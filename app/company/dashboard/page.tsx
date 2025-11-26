"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  CheckCircle,
  Loader2,
  Phone,
  Building2
} from "lucide-react";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface QueueEntry {
  id: string;
  queue_number: number;
  status: string;
  service_type: string;
  priority_type: string;
  joined_at: string;
  estimated_wait_time: number;
  user?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export default function CompanyDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [branchQueues, setBranchQueues] = useState<QueueEntry[]>([]);
  const [branchId, setBranchId] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    currentQueue: 0,
    averageWaitTime: 0,
    completedToday: 0,
    peakHour: "11:00 AM",
    efficiency: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current user's branch
  useEffect(() => {
    const getBranch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please sign in");
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          toast.error("Profile not found");
          setLoading(false);
          return;
        }

        if (profile.role === 'branch_manager') {
          const { data: branch } = await supabase
            .from('branches')
            .select('id, name')
            .eq('manager_id', user.id)
            .single();

          if (branch) {
            setBranchId(branch.id);
            setBranchName(branch.name);
          } else {
            toast.error("No branch assigned to you");
            setLoading(false);
          }
        } else if (profile.role === 'company_admin' || profile.role === 'super_admin') {
          const { data: branches } = await supabase
            .from('branches')
            .select('id, name')
            .limit(1);

          if (branches && branches.length > 0) {
            setBranchId(branches[0].id);
            setBranchName(branches[0].name);
          } else {
            toast.error("No branches found. Please create a branch first.");
            setLoading(false);
          }
        } else {
          toast.error("You don't have permission to access this page");
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting branch:', error);
        toast.error("Failed to load branch information");
        setLoading(false);
      }
    };

    getBranch();
  }, []);

  // Load all branch data
  useEffect(() => {
    if (!branchId) return;

    const loadData = async () => {
      setLoading(true);
      
      try {
        // Get queue entries with user data
        const { data: queueData, error: queueError } = await supabase
          .from('queue_entries')
          .select(`
            *,
            user:profiles(first_name, last_name, phone)
          `)
          .eq('branch_id', branchId)
          .in('status', ['waiting', 'called'])
          .order('joined_at', { ascending: true });

        if (queueError) {
          console.error('Queue error:', queueError);
        } else {
          setBranchQueues(queueData || []);
        }

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const { data: todayData } = await supabase
          .from('queue_entries')
          .select('*')
          .eq('branch_id', branchId)
          .gte('joined_at', `${today}T00:00:00`);

        const waiting = queueData?.filter(q => q.status === 'waiting').length || 0;
        const served = todayData?.filter(q => q.status === 'served').length || 0;
        const totalToday = todayData?.length || 0;
        const avgWait = queueData?.length 
          ? Math.round(queueData.reduce((sum, q) => sum + (q.estimated_wait_time || 0), 0) / queueData.length)
          : 0;
        const efficiency = totalToday > 0 ? Math.round((served / totalToday) * 100) : 0;

        setStats({
          totalCustomers: totalToday,
          currentQueue: waiting,
          averageWaitTime: avgWait,
          completedToday: served,
          peakHour: "11:00 AM",
          efficiency: efficiency
        });

      } catch (error) {
        console.error('Error loading data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `branch_id=eq.${branchId}`
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [branchId]);

  const handleCallNext = async () => {
    const nextCustomer = branchQueues.find(q => q.status === 'waiting');
    if (!nextCustomer) {
      toast.error("No customers in queue");
      return;
    }

    const { error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'called',
        called_at: new Date().toISOString()
      })
      .eq('id', nextCustomer.id);

    if (error) {
      toast.error("Failed to call next customer");
    } else {
      toast.success(`Called customer #${nextCustomer.queue_number}`);
    }
  };

  const handleMarkServed = async (queueId: string) => {
    const { error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'served',
        served_at: new Date().toISOString()
      })
      .eq('id', queueId);

    if (error) {
      toast.error("Failed to mark as served");
    } else {
      toast.success("Customer marked as served");
    }
  };

  const handleCancel = async (queueId: string) => {
    const { error } = await supabase
      .from('queue_entries')
      .update({ status: 'cancelled' })
      .eq('id', queueId);

    if (error) {
      toast.error("Failed to cancel queue entry");
    } else {
      toast.success("Queue entry cancelled");
    }
  };

  const waitingQueues = branchQueues.filter(q => q.status === 'waiting');
  const calledQueues = branchQueues.filter(q => q.status === 'called');

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CompanyLayout>
    );
  }

  if (!branchId) {
    return (
      <CompanyLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Building2 className="h-16 w-16 text-gray-400" />
          <h2 className="text-2xl font-bold">No Branch Found</h2>
          <p className="text-gray-600">Please contact an administrator to assign you to a branch.</p>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Branch Manager!</h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • {branchName}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Open
            </Badge>
            <Link href="/company/branch/settings">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.currentQueue}</div>
              <p className="text-xs text-muted-foreground">People waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageWaitTime}m</div>
              <p className="text-xs text-muted-foreground">Real-time average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Services completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Peak at {stats.peakHour}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.efficiency}%</div>
              <p className="text-xs text-muted-foreground">Service completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queue Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Current Queue Status
                  </CardTitle>
                  <CardDescription>Real-time queue management</CardDescription>
                </div>
                <Button 
                  onClick={handleCallNext}
                  disabled={waitingQueues.length === 0}
                >
                  Call Next
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Queue Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.completedToday} of {stats.totalCustomers} completed
                  </span>
                </div>
                <Progress 
                  value={stats.totalCustomers > 0 ? (stats.completedToday / stats.totalCustomers) * 100 : 0} 
                  className="h-3" 
                />

                {/* Currently Called */}
                {calledQueues.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-sm mb-3">Currently Being Served</h4>
                    {calledQueues.map((queue) => (
                      <div key={queue.id} className="flex items-center justify-between p-3 bg-white rounded-lg mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600">#{queue.queue_number}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {queue.user?.first_name} {queue.user?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {queue.user?.phone || 'No phone'}
                            </p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleMarkServed(queue.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Waiting Queue */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-sm">Waiting Queue ({waitingQueues.length})</h4>
                  {waitingQueues.map((queue) => (
                    <div key={queue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">#{queue.queue_number}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {queue.user?.first_name} {queue.user?.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {queue.service_type || 'General Service'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{queue.priority_type}</Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleCancel(queue.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                  {waitingQueues.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No customers in queue
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start"
                  onClick={handleCallNext}
                  disabled={waitingQueues.length === 0}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Call Next Customer
                </Button>
                <Link href="/company/branch/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </Link>
                <Link href="/company/branch/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Branch Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-orange-800">
                      Getting Started
                    </h4>
                    <p className="text-xs text-orange-700 mb-3">
                      No queues yet? Customers can book slots from the companies page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
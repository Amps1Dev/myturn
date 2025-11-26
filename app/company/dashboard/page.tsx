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
  Eye,
  CheckCircle,
  Loader2,
  Phone
} from "lucide-react";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";
import { QueueService } from "@/lib/services/queue.service";
import { getBranchDashboardStats, getBranchRecentActivity, getTodayAppointments } from "@/lib/services/analytics.service";
import { supabase } from "@/lib/supabase";
import type { QueueEntry } from '@/lib/supabase';

export default function CompanyDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [branchQueues, setBranchQueues] = useState<QueueEntry[]>([]);
  const [branchId, setBranchId] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('Cairo Road Branch');
  const [stats, setStats] = useState({
    totalCustomers: 0,
    currentQueue: 0,
    averageWaitTime: 0,
    completedToday: 0,
    peakHour: "11:00 AM",
    efficiency: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Get current user's branch
  useEffect(() => {
    const getBranch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get user's profile to find their branch
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'branch_manager') {
        // Get branch where user is manager
        const { data: branch } = await supabase
          .from('branches')
          .select('id, name')
          .eq('manager_id', user.id)
          .single();

        if (branch) {
          setBranchId(branch.id);
          setBranchName(branch.name);
        }
      } else if (profile?.role === 'company_admin' || profile?.role === 'super_admin') {
        // Get first branch of their company
        const { data: branches } = await supabase
          .from('branches')
          .select('id, name')
          .limit(1);

        if (branches && branches.length > 0) {
          setBranchId(branches[0].id);
          setBranchName(branches[0].name);
        }
      }
    };

    getBranch();
  }, []);

  // Load all branch data
  useEffect(() => {
    if (!branchId) return;

    const loadData = async () => {
      setLoading(true);
      
      // Load queues
      const queues = await QueueService.getBranchQueues(branchId);
      setBranchQueues(queues);

      // Load stats
      const branchStats = await getBranchDashboardStats(branchId);
      if (branchStats) {
        setStats(branchStats);
      }

      // Load recent activity
      const activity = await getBranchRecentActivity(branchId, 5);
      setRecentActivity(activity);

      // Load appointments
      const appointments = await getTodayAppointments(branchId);
      setUpcomingAppointments(appointments);

      setLoading(false);
    };

    loadData();

    // Subscribe to real-time updates
    const subscription = QueueService.subscribeToQueueUpdates(branchId, () => {
      loadData(); // Reload data on any queue update
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [branchId]);

  const handleCallNext = async () => {
    const nextCustomer = await QueueService.callNextCustomer(branchId);
    if (nextCustomer) {
      const queues = await QueueService.getBranchQueues(branchId);
      setBranchQueues(queues);
      const branchStats = await getBranchDashboardStats(branchId);
      if (branchStats) setStats(branchStats);
    }
  };

  const handleMarkServed = async (queueId: string) => {
    await QueueService.updateQueueStatus(queueId, 'served');
    const queues = await QueueService.getBranchQueues(branchId);
    setBranchQueues(queues);
    const branchStats = await getBranchDashboardStats(branchId);
    if (branchStats) setStats(branchStats);
  };

  const handleCancel = async (queueId: string) => {
    await QueueService.cancelQueue(queueId);
    const queues = await QueueService.getBranchQueues(branchId);
    setBranchQueues(queues);
    const branchStats = await getBranchDashboardStats(branchId);
    if (branchStats) setStats(branchStats);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group queues by status
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
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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
          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.currentQueue}</div>
              <p className="text-xs text-muted-foreground">People waiting</p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageWaitTime}m</div>
              <p className="text-xs text-muted-foreground">Real-time average</p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <p className="text-xs text-muted-foreground">Services completed</p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Peak at {stats.peakHour}</p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
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
          <div className="lg:col-span-2 space-y-6">
            {/* Current Queue Status */}
            <Card className="myturn-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Current Queue Status
                  </CardTitle>
                  <CardDescription>Real-time queue management</CardDescription>
                </div>
                <Button 
                  className="myturn-button-primary"
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
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{stats.currentQueue}</div>
                    <p className="text-sm text-muted-foreground">In Queue</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
                    <p className="text-sm text-muted-foreground">Served</p>
                  </div>
                </div>

                {/* Currently Called */}
                {calledQueues.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-sm mb-3 text-blue-900 dark:text-blue-100">
                      Currently Being Served
                    </h4>
                    {calledQueues.map((queue) => (
                      <div key={queue.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="font-bold text-blue-600 dark:text-blue-300">#{queue.queue_number}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {(queue as any).user?.first_name} {(queue as any).user?.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {(queue as any).user?.phone || 'No phone'}
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

                {/* Queue List */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-sm">Waiting Queue ({waitingQueues.length})</h4>
                  {waitingQueues.slice(0, 5).map((queue) => (
                    <div key={queue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">#{queue.queue_number}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {(queue as any).user?.first_name} {(queue as any).user?.last_name}
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

            {/* Recent Activity */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest customer interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.customer}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                        {activity.position && (
                          <Badge variant="secondary" className="text-xs">
                            #{activity.position}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start myturn-button-primary"
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
                <Link href="/company/branch/suggestions">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Customer Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{appointment.customer}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{appointment.service}</p>
                    <p className="text-xs font-medium">{appointment.time}</p>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No appointments today
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Queue System</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Recording</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Alert */}
            <Card className="myturn-card bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1 text-orange-800 dark:text-orange-200">
                      Peak Hour Alert
                    </h4>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">
                      Queue is expected to be busy between 11:00 AM - 1:00 PM today
                    </p>
                    <Button size="sm" variant="outline" className="text-xs border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300">
                      View Predictions
                    </Button>
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
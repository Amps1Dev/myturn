"use client"

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
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Loader2,
  Phone
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

interface QueueStats {
  totalWaiting: number;
  totalServed: number;
  avgWaitTime: number;
  activeQueues: number;
  totalToday: number;
}

const QueueManagement = () => {
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState<string>('');
  const [branchName, setBranchName] = useState<string>('');
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    totalWaiting: 0,
    totalServed: 0,
    avgWaitTime: 0,
    activeQueues: 0,
    totalToday: 0
  });

  // Get current user's branch
  useEffect(() => {
    const getBranch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'branch_manager') {
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

  // Load queue data
  useEffect(() => {
    if (!branchId) return;

    const loadQueues = async () => {
      setLoading(true);
      
      // Get queue entries with user data
      const { data: queueData, error } = await supabase
        .from('queue_entries')
        .select(`
          *,
          user:profiles(first_name, last_name, phone)
        `)
        .eq('branch_id', branchId)
        .in('status', ['waiting', 'called'])
        .order('joined_at', { ascending: true });

      if (error) {
        toast.error("Failed to load queues");
        setLoading(false);
        return;
      }

      setQueues(queueData || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayData } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('branch_id', branchId)
        .gte('joined_at', `${today}T00:00:00`);

      const waiting = queueData?.filter(q => q.status === 'waiting').length || 0;
      const served = todayData?.filter(q => q.status === 'served').length || 0;
      const avgWait = queueData?.length 
        ? Math.round(queueData.reduce((sum, q) => sum + (q.estimated_wait_time || 0), 0) / queueData.length)
        : 0;

      setStats({
        totalWaiting: waiting,
        totalServed: served,
        avgWaitTime: avgWait,
        activeQueues: 1,
        totalToday: todayData?.length || 0
      });

      setLoading(false);
    };

    loadQueues();

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
          loadQueues();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [branchId]);

  const handleCallNext = async () => {
    const nextInQueue = queues.find(q => q.status === 'waiting');
    if (!nextInQueue) {
      toast.error("No customers in queue");
      return;
    }

    const { error } = await supabase
      .from('queue_entries')
      .update({ 
        status: 'called',
        called_at: new Date().toISOString()
      })
      .eq('id', nextInQueue.id);

    if (error) {
      toast.error("Failed to call next customer");
    } else {
      toast.success(`Called customer #${nextInQueue.queue_number}`);
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
      .update({ 
        status: 'cancelled'
      })
      .eq('id', queueId);

    if (error) {
      toast.error("Failed to cancel queue entry");
    } else {
      toast.success("Queue entry cancelled");
    }
  };

  const waitingQueues = queues.filter(q => q.status === 'waiting');
  const calledQueues = queues.filter(q => q.status === 'called');

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
    <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e]">
      <CompanyLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-[#6e473b]" />
            <div>
              <h1 className="text-3xl font-bold">Queue Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor and manage queues for {branchName}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#6e473b] border-[#beb5a9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
              <Users className="h-4 w-4 text-[#a78d78]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalWaiting}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Across all queues
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#6e473b] border-[#beb5a9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Served Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServed}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Services completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#6e473b] border-[#beb5a9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-[#a78d78]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgWaitTime} min</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Current average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#6e473b] border-[#beb5a9]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalToday}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All customers today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Queue List */}
        <Card className="bg-white dark:bg-[#6e473b] border-[#beb5a9]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Current Queue</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Real-time queue status
                </CardDescription>
              </div>
              <Button 
                className="bg-[#6e473b] hover:bg-[#a78d78] text-white"
                onClick={handleCallNext}
                disabled={waitingQueues.length === 0}
              >
                Call Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Currently Called */}
            {calledQueues.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
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
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Waiting Queue ({waitingQueues.length})</h4>
              {waitingQueues.map((queue) => (
                <div key={queue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
      </CompanyLayout>
    </div>
  );
};

export default QueueManagement;
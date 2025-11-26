"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Calendar,
  TrendingUp,
  Building2,
  CheckCircle,
  AlertCircle,
  Plus,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { ClientLayout } from "@/components/client-layout";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ClientDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeQueues, setActiveQueues] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeQueues: 0,
    timeSaved: 0,
    completedVisits: 0
  });

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setIsLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch active queues and stats
  useEffect(() => {
    if (!userId) return;
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get active queues
        const { data: queues, error: queueError } = await supabase
          .from('queue_entries')
          .select(`
            *,
            institution:institutions(name, location, status),
            branch:branches(name, address)
          `)
          .eq('user_id', userId)
          .in('status', ['waiting', 'called'])
          .order('joined_at', { ascending: false });

        if (queueError) throw queueError;
        setActiveQueues(queues || []);

        // Get completed queues for stats
        const { data: completedQueues } = await supabase
          .from('queue_entries')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'served');

        // Calculate time saved (assuming 30 mins saved per visit)
        const timeSaved = (completedQueues?.length || 0) * 0.5;

        setStats({
          activeQueues: queues?.length || 0,
          timeSaved: Math.round(timeSaved * 10) / 10,
          completedVisits: completedQueues?.length || 0
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('user_queues')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLeaveQueue = async (queueId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('queue_entries')
        .update({ status: 'cancelled' })
        .eq('id', queueId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("Successfully left the queue");
      setActiveQueues(prev => prev.filter(q => q.id !== queueId));
    } catch (error) {
      console.error('Error leaving queue:', error);
      toast.error("Failed to leave queue");
    }
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link href="/client/companies">
            <Button className="myturn-button-primary">
              <Plus className="mr-2 h-4 w-4" />
              Join Queue
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeQueues}</div>
              <p className="text-xs text-muted-foreground">
                Currently waiting
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.timeSaved}h</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedVisits}</div>
              <p className="text-xs text-muted-foreground">
                Queue visits
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Visit</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeQueues.length > 0 ? 'Active' : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeQueues.length > 0 ? 'In progress' : 'No upcoming visits'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Queue Status */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Queues
                </CardTitle>
                <CardDescription>Your active queue positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeQueues.length > 0 ? (
                  activeQueues.map((queue) => (
                    <div key={queue.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {queue.institution?.name || 'Unknown Institution'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Joined at {new Date(queue.joined_at).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge variant={queue.status === 'waiting' ? 'secondary' : 'default'}>
                          {queue.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Queue Number</span>
                          <span className="font-medium text-lg">#{queue.queue_number}</span>
                        </div>
                        <Progress value={70} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Est. {queue.estimated_wait_time} mins
                          </span>
                          <div className="flex items-center gap-2">
                            <Link href="/client/my-queue">
                              <Button variant="ghost" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLeaveQueue(queue.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-medium mb-2">No active queues</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Join a queue to get started
                    </p>
                    <Link href="/client/companies">
                      <Button className="myturn-button-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Join Queue
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/client/companies">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Building2 className="mr-2 h-4 w-4" />
                    Browse Institutions
                  </Button>
                </Link>
                <Link href="/client/notifications">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </Link>
                <Link href="/client/subscription">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Go Premium
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="myturn-card bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Pro Tip</h4>
                    <p className="text-xs text-muted-foreground">
                      Enable notifications to get alerts when it's almost your turn
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
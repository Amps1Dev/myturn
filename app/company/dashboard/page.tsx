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
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Building2
} from "lucide-react";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";

export default function CompanyDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const todayStats = {
    totalCustomers: 127,
    currentQueue: 18,
    averageWaitTime: 23,
    completedToday: 109,
    peakHour: "11:00 AM"
  };

  const institutionId = 'zanaco-bank-cairo'; // branch identifier used by bookings
  const [branchBookings, setBranchBookings] = useState<Array<any>>([]);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    const storageKey = 'myturn_bookings';
    const loadBookings = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const all = raw ? JSON.parse(raw) : [];
        const forBranch = all.filter((b: any) => String(b.institutionId) === String(institutionId));
        setBranchBookings(forBranch);
      } catch (e) {
        setBranchBookings([]);
      }
    };
    loadBookings();
    // also try to load the signed-in client profile
    try {
      // prefer cookie
      const match = document.cookie.match(/(?:^|; )myturn_user=([^;]+)/);
      if (match) {
        setUserProfile(JSON.parse(decodeURIComponent(match[1])));
      } else {
        const rawProfile = localStorage.getItem('myturn_profile');
        if (rawProfile) setUserProfile(JSON.parse(rawProfile));
      }
    } catch (e) {
      // ignore
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) loadBookings();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cancelBooking = (bookingId: string) => {
    try {
      const storageKey = 'myturn_bookings';
      const raw = localStorage.getItem(storageKey);
      const existing = raw ? JSON.parse(raw) : [];
      const filtered = existing.filter((b: any) => String(b.id) !== String(bookingId));
      localStorage.setItem(storageKey, JSON.stringify(filtered));
      setBranchBookings((prev) => prev.filter(b => String(b.id) !== String(bookingId)));
    } catch (e) {
      console.error('Failed to cancel booking', e);
    }
  };

  const markCalled = (bookingId: string) => {
    try {
      const storageKey = 'myturn_bookings';
      const raw = localStorage.getItem(storageKey);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = existing.map((b: any) => {
        if (String(b.id) === String(bookingId)) {
          return { ...b, status: 'called', calledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        }
        return b;
      });
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setBranchBookings(updated.filter((b: any) => String(b.institutionId) === String(institutionId)));
    } catch (e) {
      console.error('Failed to mark booking called', e);
    }
  };

  // Only count bookings for the signed-in user for this branch (no fake numbers)
  const branchBookingsForUser = userProfile
    ? branchBookings.filter((b: any) => b.user && (b.user.email === userProfile.email || b.user.email === userProfile?.email))
    : [];

  const dynamicCurrentQueue = branchBookingsForUser.length;
  const dynamicTotalCustomers = branchBookingsForUser.length;

  // derive recent activity and upcoming appointments from the user's bookings only
  const recentActivity = branchBookingsForUser.map((b: any, i: number) => ({
    id: b.id || i,
    customer: b.user?.firstName ? `${b.user.firstName} ${b.user.lastName?.charAt(0)}.` : (b.user?.email || 'You'),
    action: b.status === 'booked' ? 'Joined queue' : b.status || 'Booked',
    time: b.joinedAt || '-',
    position: b.position || null,
  }));

  const upcomingAppointments = branchBookingsForUser.map((b: any, i: number) => ({
    id: b.id || i,
    customer: b.user?.firstName ? `${b.user.firstName} ${b.user.lastName?.charAt(0)}.` : (b.user?.email || 'You'),
    service: b.service || 'Service',
    time: b.joinedAt || '-',
    status: b.status === 'booked' ? 'confirmed' : (b.status || 'pending'),
  }));

  return (
    <CompanyLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Zanaco Bank!</h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • Cairo Road Branch
            </p>
          </div>
            {branchBookingsForUser.length > 0 && (
              <div className="ml-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                  <div className="text-sm font-medium">You have {branchBookingsForUser.length} booking{branchBookingsForUser.length>1?'s':''} at this branch</div>
                  <div className="mt-2 space-y-1 text-sm">
                    {branchBookingsForUser.map((b) => (
                      <div key={b.id} className="flex items-center justify-between gap-2">
                        <div className="truncate">{b.institutionName || 'Booking'} • {b.joinedAt || ''} {b.status === 'called' && <span className="text-xs text-blue-600 ml-2">(Called)</span>}</div>
                        <div className="flex items-center gap-2">
                          {b.status !== 'called' && (
                            <button onClick={() => markCalled(b.id)} className="text-sm text-primary-600 hover:underline">Mark Called</button>
                          )}
                          <button onClick={() => cancelBooking(b.id)} className="text-sm text-red-600 hover:underline">Cancel</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
              <div className="text-2xl font-bold text-primary">{dynamicCurrentQueue}</div>
              <p className="text-xs text-muted-foreground">
                People waiting
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.averageWaitTime}m</div>
              <p className="text-xs text-muted-foreground">
                -5m from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dynamicTotalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Peak at {todayStats.peakHour}
              </p>
            </CardContent>
          </Card>

          <Card className="myturn-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">
                Service completion
              </p>
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
                <Link href="/company/branch/queue">
                  <Button className="myturn-button-primary">
                    <Eye className="mr-2 h-4 w-4" />
                    Manage Queue
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Queue Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {todayStats.completedToday} of {dynamicTotalCustomers} completed
                  </span>
                </div>
                <Progress value={85} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{dynamicCurrentQueue}</div>
                    <p className="text-sm text-muted-foreground">In Queue</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{todayStats.completedToday}</div>
                    <p className="text-sm text-muted-foreground">Served</p>
                  </div>
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
                </div>
                <Link href="/company/branch/queue">
                  <Button variant="ghost" className="w-full mt-4">
                    View All Activity
                  </Button>
                </Link>
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
                <Link href="/company/branch/queue">
                  <Button className="w-full justify-start myturn-button-primary">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Queue
                  </Button>
                </Link>
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

            {/* Upcoming Appointments */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{appointment.customer}</h4>
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{appointment.service}</p>
                    <p className="text-xs font-medium">{appointment.time}</p>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  <Plus className="mr-2 h-3 w-3" />
                  View All Appointments
                </Button>
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
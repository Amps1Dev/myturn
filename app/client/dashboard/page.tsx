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
  Plus
} from "lucide-react";
import Link from "next/link";
import { ClientLayout } from "@/components/client-layout";
import { zambianInstitutions, getPopularInstitutions } from "@/lib/data/institutions";

export default function ClientDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const popularInstitutions = getPopularInstitutions();
  const activeQueues = [
    {
      id: '1',
      institution: 'Zanaco Bank - Cairo Branch',
      position: 3,
      estimatedTime: 15,
      status: 'active',
      joinedAt: '09:30 AM'
    }
  ];

  const upcomingAppointments = [
    {
      id: '1',
      institution: 'RTSA - Driving License',
      date: 'Today',
      time: '2:00 PM',
      status: 'confirmed'
    }
  ];

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, John!</h1>
            <p className="text-muted-foreground mt-1">
              {currentTime.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link href="/client/book-slot">
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
              <div className="text-2xl font-bold">1</div>
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
              <div className="text-2xl font-bold">4.2h</div>
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
              <div className="text-2xl font-bold">12</div>
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
              <div className="text-2xl font-bold">2:00 PM</div>
              <p className="text-xs text-muted-foreground">
                Today at RTSA
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Queue Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Queues */}
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
                          <h4 className="font-medium">{queue.institution}</h4>
                          <p className="text-sm text-muted-foreground">
                            Joined at {queue.joinedAt}
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Position in queue</span>
                          <span className="font-medium">#{queue.position}</span>
                        </div>
                        <Progress value={70} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Est. {queue.estimatedTime} mins
                          </span>
                          <Link href="/client/my-queue">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </Link>
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
                    <Link href="/client/book-slot">
                      <Button className="myturn-button-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Join Queue
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Institutions */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Institutions
                </CardTitle>
                <CardDescription>Trending places near you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {popularInstitutions.slice(0, 4).map((institution) => (
                    <div key={institution.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{institution.name}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {institution.location}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={institution.status === 'open' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {institution.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {institution.currentQueue} in queue
                              </span>
                            </div>
                            <Link href={`/client/book-slot?institution=${institution.id}`}>
                              <Button size="sm" variant="ghost" className="text-xs">
                                Join
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Appointments */}
            <Card className="myturn-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{appointment.institution}</h4>
                        <p className="text-xs text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/client/book-slot">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="mr-2 h-3 w-3" />
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>

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
                      Enable notifications to get alerts 10 minutes before your turn
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
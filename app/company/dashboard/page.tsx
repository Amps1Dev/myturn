"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, LogOut, Building2, Mail, Phone, Calendar, Clock, BarChart, Settings } from "lucide-react";
import { toast } from "sonner";

export default function CompanyDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        toast.error('Failed to load user data');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Something went wrong');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLogoutLoading(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/');
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLogoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MyTurn Business</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            onClick={handleLogout}
            disabled={isLogoutLoading}
            variant="outline"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLogoutLoading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome, {user.firstName}! 🏢</h1>
            <p className="text-muted-foreground mt-2">
              Manage your {user.companyName || 'company'} operations
            </p>
          </div>

          {/* Company Profile Card */}
          <Card className="myturn-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Profile
              </CardTitle>
              <CardDescription>
                Your company information and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Company Name</p>
                    <p className="text-sm text-muted-foreground">
                      {user.companyName || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Business Type</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.businessType || 'Not specified'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Contact Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="myturn-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Today's Queue</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="myturn-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="myturn-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="myturn-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">0 min</p>
                    <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  </div>
                  <BarChart className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tools */}
          <Card className="myturn-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Management Tools
              </CardTitle>
              <CardDescription>
                Manage your queue, appointments, and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="w-6 h-6" />
                  <span>Manage Queue</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span>Appointments</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart className="w-6 h-6" />
                  <span>Analytics</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Settings</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Clock className="w-6 h-6" />
                  <span>Operating Hours</span>
                </Button>

                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Mail className="w-6 h-6" />
                  <span>Notifications</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="myturn-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Recent customer interactions and queue activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Activity will appear here once customers start using your services
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
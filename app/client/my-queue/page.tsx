"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Gift,
  Sun,
  Moon
} from "lucide-react";

export default function QueueDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const themeClasses = isDarkMode
    ? "bg-[#291c0e] text-white"
    : "bg-[#e1d4c2] text-[#291c0e]";

  const cardClasses = isDarkMode
    ? "bg-[#6e473b] border-[#a78d78] text-white"
    : "bg-white border-[#beb5a9] text-[#291c0e]";

  const sidebarClasses = isDarkMode
    ? "bg-[#6e473b] border-[#a78d78]"
    : "bg-[#291c0e] border-[#a78d78]";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 transition-colors duration-300 ${sidebarClasses} border-r`}>
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-[#a78d78] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MyTurn</span>
          </div>

          <nav className="space-y-2">
            <div className="bg-[#a78d78] rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Dashboard</span>
              </div>
            </div>
            
            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>My Queues</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Book Slot</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Companies</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Profile</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Suggestions</span>
              </div>
            </div>

            <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Premium</span>
              </div>
            </div>
          </nav>
        </div>

        <div className="absolute bottom-6 left-6">
          <div className="p-3 text-[#beb5a9] hover:bg-[#a78d78] hover:text-white rounded-lg transition-colors cursor-pointer">
            <span>Sign out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="p-6 border-b border-[#beb5a9]">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-[#a78d78]">{formatDate(currentTime)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={toggleTheme}
                className={`border-[#a78d78] ${isDarkMode ? 'hover:bg-[#a78d78]' : 'hover:bg-[#291c0e] hover:text-white'}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button className="bg-[#291c0e] hover:bg-[#6e473b] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Join Queue
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-[#a78d78] text-white">JD</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-[#a78d78]">Client</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className={`transition-colors duration-300 ${cardClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
                <Users className="h-4 w-4 text-[#a78d78]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-[#a78d78]">Currently waiting</p>
              </CardContent>
            </Card>

            <Card className={`transition-colors duration-300 ${cardClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
                <Clock className="h-4 w-4 text-[#a78d78]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2h</div>
                <p className="text-xs text-[#a78d78]">This month</p>
              </CardContent>
            </Card>

            <Card className={`transition-colors duration-300 ${cardClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-[#a78d78]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-[#a78d78]">Queue visits</p>
              </CardContent>
            </Card>

            <Card className={`transition-colors duration-300 ${cardClasses}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Visit</CardTitle>
                <Calendar className="h-4 w-4 text-[#a78d78]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(currentTime)}</div>
                <p className="text-xs text-[#a78d78]">Today at RTSA</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Queues */}
            <div className="lg:col-span-2">
              <Card className={`transition-colors duration-300 ${cardClasses}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Current Queues</span>
                  </CardTitle>
                  <CardDescription>Your active queue positions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-[#e1d4c2] border-[#beb5a9]'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">Zanaco Bank - Cairo Branch</h3>
                          <p className="text-sm text-[#a78d78]">Joined at 09:30 AM</p>
                        </div>
                        <Badge className="bg-[#a78d78] text-white">Active</Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Position in queue</span>
                          <span className="font-bold">#3</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#a78d78]" />
                          <span className="text-sm">Est. 15 mins</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                          >
                            <Gift className="w-4 h-4 mr-1" />
                            Gift
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming */}
            <div>
              <Card className={`mb-6 transition-colors duration-300 ${cardClasses}`}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Upcoming</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#a78d78] rounded-full"></div>
                      <div>
                        <p className="font-medium">RTSA - Driving License</p>
                        <p className="text-sm text-[#a78d78]">Today at 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className={`transition-colors duration-300 ${cardClasses}`}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Browse Institutions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#a78d78] text-[#a78d78] hover:bg-[#a78d78] hover:text-white"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Go Premium
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Tip */}
              <Card className={`mt-6 transition-colors duration-300 ${cardClasses}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-[#a78d78] mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Pro Tip</h4>
                      <p className="text-sm text-[#a78d78]">
                        Enable notifications to get alerts 10 minutes before your turn
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Popular Institutions */}
          <Card className={`mt-8 transition-colors duration-300 ${cardClasses}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Popular Institutions</span>
              </CardTitle>
              <CardDescription>Trending places near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-[#e1d4c2] border-[#beb5a9]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-[#a78d78]" />
                      <div>
                        <h3 className="font-semibold">Zanaco Bank - Cairo Branch</h3>
                        <p className="text-sm text-[#a78d78] flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Cairo Road, Lusaka
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-[#a78d78] text-white">Open</Badge>
                      <span className="text-sm">12 in queue</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#291c0e] hover:bg-[#6e473b] text-white"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-[#e1d4c2] border-[#beb5a9]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-[#a78d78]" />
                      <div>
                        <h3 className="font-semibold">Stanbic Bank Zambia - Main Branch</h3>
                        <p className="text-sm text-[#a78d78] flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          Stanbic House, Cairo Road, Lusaka
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Busy</Badge>
                      <span className="text-sm">18 in queue</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#291c0e] hover:bg-[#6e473b] text-white"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-[#e1d4c2] border-[#beb5a9]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-[#a78d78]" />
                      <div>
                        <h3 className="font-semibold">Road Transport and Safety Agency (RTSA)</h3>
                        <p className="text-sm text-[#a78d78] flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          RTSA House, Dedan Kimathi Road, Lusaka
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Busy</Badge>
                      <span className="text-sm">25 in queue</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#291c0e] hover:bg-[#6e473b] text-white"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border transition-colors duration-300 ${isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-[#e1d4c2] border-[#beb5a9]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-5 h-5 text-[#a78d78]" />
                      <div>
                        <h3 className="font-semibold">Zambia Revenue Authority (ZRA)</h3>
                        <p className="text-sm text-[#a78d78] flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          ZRA House, Cairo Road, Lusaka
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-[#a78d78] text-white">Open</Badge>
                      <span className="text-sm">20 in queue</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#291c0e] hover:bg-[#6e473b] text-white"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
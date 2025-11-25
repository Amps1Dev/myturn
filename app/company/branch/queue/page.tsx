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
  Building2
} from "lucide-react";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";

// Base queue definitions (labels/services). Counts are computed dynamically from bookings.
const baseQueues = [
  {
    id: 1,
    name: "Customer Service",
    currentNumber: 45,
    totalServed: 132,
    waitingCount: 12,
    avgWaitTime: "8 min",
    status: "active",
    lastUpdated: "2 min ago"
  },
  {
    id: 2,
    name: "Technical Support",
    currentNumber: 23,
    totalServed: 67,
    waitingCount: 8,
    avgWaitTime: "12 min",
    status: "active",
    lastUpdated: "1 min ago"
  },
  {
    id: 3,
    name: "Sales Consultation",
    currentNumber: 15,
    totalServed: 89,
    waitingCount: 5,
    avgWaitTime: "15 min",
    status: "paused",
    lastUpdated: "5 min ago"
  },
  {
    id: 4,
    name: "Billing & Accounts",
    currentNumber: 8,
    totalServed: 34,
    waitingCount: 3,
    avgWaitTime: "6 min",
    status: "active",
    lastUpdated: "Just now"
  }
];

const QueueManagement = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [queues, setQueues] = useState(baseQueues);
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [branchBookings, setBranchBookings] = useState<Array<any>>([]);
  // detect branch id: prefer cookie `myturn_branch`, fallback to hardcoded id
  const [institutionId, setInstitutionId] = useState<string>(() => {
    try {
      const m = document?.cookie?.match(/(?:^|; )myturn_branch=([^;]+)/);
      if (m) return decodeURIComponent(m[1]);
    } catch (e) {
      // ignore
    }
    return 'zanaco-bank-cairo';
  });

  useEffect(() => {
    // Apply theme class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // load bookings for this branch from localStorage
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
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) loadBookings();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [institutionId]);

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

  const callNext = (queueName: string) => {
    try {
      // find earliest booking for this branch and service that is still 'booked'
      const pending = branchBookings
        .filter((b: any) => (b.status === 'booked') && (b.service || '').toLowerCase().includes(queueName.split(' ')[0].toLowerCase()));
      if (pending.length === 0) return;
      // booking ids are 'b_<timestamp>' so pick min timestamp
      let next = pending[0];
      let minTs = Number((String(next.id) || '').split('_')[1] || Date.now());
      for (const p of pending) {
        const ts = Number((String(p.id) || '').split('_')[1] || Date.now());
        if (ts < minTs) { minTs = ts; next = p; }
      }
      if (next && next.id) markCalled(next.id);
    } catch (e) {
      console.error('Failed to call next', e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'closed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Dynamic metrics derived from branchBookings
  const getTotalWaiting = () => branchBookings.filter((b: any) => b.status === 'booked').length;
  const getTotalServed = () => branchBookings.filter((b: any) => b.status === 'called').length;
  const getAvgWaitTime = () => {
    // best-effort: if bookings include estimatedTime in mins, average them
    const mins = branchBookings
      .map((b: any) => {
        if (!b.estimatedTime) return null;
        const m = String(b.estimatedTime).match(/(\d+)/);
        return m ? parseInt(m[1], 10) : null;
      })
      .filter((v: any) => v != null) as number[];
    if (mins.length === 0) return 0;
    return Math.round(mins.reduce((s, v) => s + v, 0) / mins.length);
  };

  // map base queues to include counts from bookings
  const queuesWithCounts = queues.map((q) => {
    const waiting = branchBookings.filter((b: any) => (b.service || '').toLowerCase().includes(q.name.split(' ')[0].toLowerCase())).length;
    const called = branchBookings.filter((b: any) => (b.service || '').toLowerCase().includes(q.name.split(' ')[0].toLowerCase()) && b.status === 'called').length;
    return { ...q, waitingCount: waiting, totalServed: called };
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-[#291c0e] text-white' 
        : 'bg-[#e1d4c2] text-gray-900'
    }`}>
      <CompanyLayout>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-[#6e473b]" />
            <div>
              <h1 className="text-3xl font-bold">Queue Management</h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Monitor and manage queues for {institutionId}
                  </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              aria-label="Select time range"
              className={`px-3 py-2 rounded-lg border transition-colors ${
                darkMode 
                  ? 'bg-[#6e473b] border-[#a78d78] text-white' 
                  : 'bg-white border-[#a78d78] text-gray-900'
              }`}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            
            <Button 
              className={`${
                darkMode 
                  ? 'bg-[#a78d78] hover:bg-[#6e473b] text-white' 
                  : 'bg-[#6e473b] hover:bg-[#291c0e] text-white'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Queue
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={`$${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Waiting</CardTitle>
              <Users className="h-4 w-4 text-[#a78d78]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalWaiting()}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Across all queues
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Served Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalServed()}</div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-[#a78d78]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAvgWaitTime()} min</div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                -2 min from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Queues</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {queuesWithCounts.filter(q => q.status === 'active').length}
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Out of {queues.length} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Queue List */}
        <Card className={`${
          darkMode 
            ? 'bg-[#6e473b] border-[#a78d78] text-white' 
            : 'bg-white border-[#beb5a9]'
        }`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Queue Overview</CardTitle>
                <CardDescription className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Real-time status of all your queues
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queuesWithCounts.map((queue) => (
                <div 
                  key={queue.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-[#291c0e] border-[#a78d78] hover:bg-[#6e473b]' 
                      : 'bg-[#e1d4c2] border-[#beb5a9] hover:bg-[#beb5a9]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{queue.name}</h3>
                      <Badge className={getStatusColor(queue.status)}>
                        {queue.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Current Number
                      </p>
                        <p className="text-xl font-bold text-[#a78d78]">#{queue.currentNumber || '-'}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Waiting
                      </p>
                        <p className="text-xl font-bold">{queue.waitingCount}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Served Today
                      </p>
                        <p className="text-xl font-bold">{queue.totalServed}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Avg Wait
                      </p>
                        <p className="text-xl font-bold">{queue.avgWaitTime || `${getAvgWaitTime()} min`}</p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last Updated
                      </p>
                        <p className="text-sm">{queue.lastUpdated || '-'}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex-1 mr-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Queue Progress</span>
                        <span>{Math.round((queue.totalServed / (queue.totalServed + queue.waitingCount)) * 100)}%</span>
                      </div>
                      <Progress 
                        value={Math.round((queue.totalServed / (queue.totalServed + queue.waitingCount)) * 100)} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      {queue.status === 'active' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          className={`${
                            darkMode 
                              ? 'bg-[#a78d78] hover:bg-[#6e473b]' 
                              : 'bg-[#6e473b] hover:bg-[#291c0e]'
                          } text-white`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        className={`${
                          darkMode 
                            ? 'bg-[#a78d78] hover:bg-[#6e473b]' 
                            : 'bg-[#6e473b] hover:bg-[#291c0e]'
                        } text-white`}
                        onClick={() => {
                          // call the next booking for this queue
                          callNext(queue.name);
                        }}
                      >
                        Call Next
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage queue schedules and operating hours
              </p>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Manage Schedules
              </Button>
            </CardContent>
          </Card>

          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configure alerts for long wait times and issues
              </p>
              <Button 
                variant="outline" 
                className="w-full"
              >
                Configure Alerts
              </Button>
            </CardContent>
          </Card>

          <Card className={`${
            darkMode 
              ? 'bg-[#6e473b] border-[#a78d78] text-white' 
              : 'bg-white border-[#beb5a9]'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View detailed analytics and generate reports
              </p>
              <Link href="/company/analytics">
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </CompanyLayout>
    </div>
  );
};

export default QueueManagement;
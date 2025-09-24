"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, MapPin, Timer, Activity, Calendar, Download, Filter, UserCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('queues');

  // Queue management specific data
  const queueMetricsData = [
    { name: 'Mon', activeQueues: 24, completedQueues: 180, avgWaitTime: 12 },
    { name: 'Tue', activeQueues: 18, completedQueues: 156, avgWaitTime: 15 },
    { name: 'Wed', activeQueues: 32, completedQueues: 245, avgWaitTime: 8 },
    { name: 'Thu', activeQueues: 28, completedQueues: 198, avgWaitTime: 11 },
    { name: 'Fri', activeQueues: 35, completedQueues: 287, avgWaitTime: 6 },
    { name: 'Sat', activeQueues: 42, completedQueues: 312, avgWaitTime: 9 },
    { name: 'Sun', activeQueues: 29, completedQueues: 201, avgWaitTime: 14 }
  ];

  const institutionTypes = [
    { name: 'Banks', value: 35, color: '#291c0e' },
    { name: 'Hospitals', value: 25, color: '#6e473b' },
    { name: 'Government', value: 20, color: '#a78d78' },
    { name: 'Retail', value: 15, color: '#beb5a9' },
    { name: 'Other', value: 5, color: '#e1d4c2' }
  ];

  const topInstitutions = [
    { name: 'Central Bank Branch A', totalQueues: 1250, avgWait: '8 min', satisfaction: '94%' },
    { name: 'City Hospital Emergency', totalQueues: 890, avgWait: '15 min', satisfaction: '87%' },
    { name: 'Tax Office Downtown', totalQueues: 670, avgWait: '22 min', satisfaction: '76%' },
    { name: 'Metro Mall Customer Service', totalQueues: 540, avgWait: '12 min', satisfaction: '91%' },
    { name: 'University Registrar', totalQueues: 320, avgWait: '18 min', satisfaction: '83%' }
  ];

  const peakHoursData = [
    { hour: '8AM', queues: 45 },
    { hour: '9AM', queues: 78 },
    { hour: '10AM', queues: 92 },
    { hour: '11AM', queues: 156 },
    { hour: '12PM', queues: 201 },
    { hour: '1PM', queues: 134 },
    { hour: '2PM', queues: 167 },
    { hour: '3PM', queues: 189 },
    { hour: '4PM', queues: 145 },
    { hour: '5PM', queues: 98 },
    { hour: '6PM', queues: 56 }
  ];

  // Key metrics for queue management
  const metrics = [
    {
      title: 'Active Queues',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-[#291c0e]',
      description: 'Currently waiting'
    },
    {
      title: 'Avg Wait Time',
      value: '11 min',
      change: '-15%',
      trend: 'up',
      icon: Clock,
      bgColor: 'bg-[#6e473b]',
      description: 'Across all queues'
    },
    {
      title: 'Completed Today',
      value: '2,847',
      change: '+8.2%',
      trend: 'up',
      icon: UserCheck,
      bgColor: 'bg-[#a78d78]',
      description: 'Successful completions'
    },
    {
      title: 'Institutions',
      value: '48',
      change: '+12%',
      trend: 'up',
      icon: MapPin,
      bgColor: 'bg-[#6e473b]',
      description: 'Active partners'
    }
  ];

  return (
    <div className="min-h-screen bg-[#e1d4c2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#291c0e]">MyTurn Analytics</h1>
              <p className="text-[#6e473b] mt-1">Queue management insights and performance metrics</p>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-[#beb5a9] bg-white rounded-lg focus:ring-2 focus:ring-[#a78d78] focus:border-transparent text-[#291c0e]"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#291c0e] text-white rounded-lg hover:bg-[#6e473b] transition-colors">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-[#6e473b]' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#291c0e] mb-1">{metric.value}</h3>
                <p className="text-[#6e473b] text-sm font-medium">{metric.title}</p>
                <p className="text-[#a78d78] text-xs mt-1">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Queue Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#291c0e]">Queue Activity</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedMetric('queues')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedMetric === 'queues' 
                      ? 'bg-[#a78d78] text-white' 
                      : 'text-[#6e473b] hover:bg-[#e1d4c2]'
                  }`}
                >
                  Active Queues
                </button>
                <button 
                  onClick={() => setSelectedMetric('completed')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedMetric === 'completed' 
                      ? 'bg-[#a78d78] text-white' 
                      : 'text-[#6e473b] hover:bg-[#e1d4c2]'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={queueMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#beb5a9" />
                <XAxis dataKey="name" stroke="#6e473b" />
                <YAxis stroke="#6e473b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #beb5a9',
                    borderRadius: '8px',
                    color: '#291c0e'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric === 'queues' ? 'activeQueues' : 'completedQueues'} 
                  stroke="#291c0e" 
                  fill="#291c0e" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Institution Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6">
            <h2 className="text-xl font-semibold text-[#291c0e] mb-6">Queue Distribution by Institution Type</h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={institutionTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {institutionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #beb5a9',
                      borderRadius: '8px',
                      color: '#291c0e'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#291c0e] mb-6">Peak Hours Analysis</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#beb5a9" />
              <XAxis dataKey="hour" stroke="#6e473b" />
              <YAxis stroke="#6e473b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #beb5a9',
                  borderRadius: '8px',
                  color: '#291c0e'
                }} 
              />
              <Bar dataKey="queues" fill="#a78d78" name="Queue Joins" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Institutions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#291c0e]">Top Performing Institutions</h2>
            <button className="flex items-center gap-2 px-3 py-2 text-[#6e473b] hover:bg-[#e1d4c2] rounded-lg transition-colors">
              <Filter size={16} />
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#beb5a9]">
                  <th className="text-left py-3 px-4 font-semibold text-[#291c0e]">Institution</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#291c0e]">Total Queues</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#291c0e]">Avg Wait Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#291c0e]">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {topInstitutions.map((institution, index) => (
                  <tr key={index} className="border-b border-[#e1d4c2] hover:bg-[#e1d4c2] transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-[#291c0e]">{institution.name}</span>
                    </td>
                    <td className="py-4 px-4 text-[#6e473b]">
                      {institution.totalQueues.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseInt(institution.avgWait) > 15 
                          ? 'bg-red-100 text-red-700' 
                          : parseInt(institution.avgWait) > 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {institution.avgWait}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          parseInt(institution.satisfaction) > 90 
                            ? 'bg-green-100 text-green-700' 
                            : parseInt(institution.satisfaction) > 80
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {institution.satisfaction}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Queue Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-[#beb5a9] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-[#6e473b]" />
            <h2 className="text-xl font-semibold text-[#291c0e]">Live Queue Activity</h2>
            <div className="w-2 h-2 bg-[#6e473b] rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[
              { user: 'Customer #4521', action: 'joined queue at', location: 'Central Bank Branch A', time: '5 seconds ago', status: 'waiting' },
              { user: 'Customer #3387', action: 'completed service at', location: 'City Hospital Emergency', time: '23 seconds ago', status: 'completed' },
              { user: 'Customer #7892', action: 'left queue at', location: 'Tax Office Downtown', time: '1 minute ago', status: 'left' },
              { user: 'Customer #2156', action: 'joined queue at', location: 'Metro Mall Customer Service', time: '2 minutes ago', status: 'waiting' },
              { user: 'Customer #9043', action: 'called to service at', location: 'University Registrar', time: '3 minutes ago', status: 'serving' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 px-4 bg-[#e1d4c2] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-[#6e473b]' :
                    activity.status === 'serving' ? 'bg-[#a78d78]' :
                    activity.status === 'left' ? 'bg-red-500' : 'bg-[#291c0e]'
                  }`}>
                    {activity.status === 'completed' ? '✓' :
                     activity.status === 'serving' ? '⏳' :
                     activity.status === 'left' ? '✗' : '⏱️'}
                  </div>
                  <div>
                    <span className="font-medium text-[#291c0e]">{activity.user}</span>
                    <span className="text-[#6e473b] ml-2">{activity.action}</span>
                    <span className="font-medium text-[#a78d78] ml-1">{activity.location}</span>
                  </div>
                </div>
                <span className="text-[#6e473b] text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Status Banner */}
        <div className="bg-[#6e473b] text-white rounded-xl p-4 mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} />
            <div>
              <h3 className="font-semibold">System Status: All Systems Operational</h3>
              <p className="text-sm opacity-90">All queue management services running smoothly across 48 institutions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
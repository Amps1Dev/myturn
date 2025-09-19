"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, TrendingUp, AlertCircle, Calendar, Settings, BarChart3, MessageSquare, Plus, Eye, CheckCircle, XCircle, Building2, Star, ThumbsUp, ThumbsDown, Filter, Search, Download } from "lucide-react";
import Link from "next/link";
import { CompanyLayout } from "@/components/company-layout";

export default function CustomerFeedback() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  // Sample feedback data
  const feedbackData = [
    {
      id: 1,
      customerName: "John Smith",
      rating: 5,
      category: "Service Quality",
      message: "Excellent service! The queue system was very efficient and staff were professional.",
      date: "2024-09-18",
      status: "reviewed",
      queueType: "Customer Service",
      waitTime: "15 min"
    },
    {
      id: 2,
      customerName: "Sarah Johnson",
      rating: 2,
      category: "Wait Time",
      message: "Waited too long despite having an appointment. The system needs improvement.",
      date: "2024-09-17",
      status: "pending",
      queueType: "Appointments",
      waitTime: "45 min"
    },
    {
      id: 3,
      customerName: "Mike Chen",
      rating: 4,
      category: "Staff Behavior",
      message: "Friendly staff, but the waiting area could be more comfortable.",
      date: "2024-09-16",
      status: "responded",
      queueType: "General Inquiry",
      waitTime: "12 min"
    },
    {
      id: 4,
      customerName: "Emily Davis",
      rating: 5,
      category: "Overall Experience",
      message: "Great digital queue system! No confusion about my place in line.",
      date: "2024-09-15",
      status: "reviewed",
      queueType: "Customer Service",
      waitTime: "8 min"
    }
  ];

  const feedbackStats = {
    totalFeedback: 248,
    avgRating: 4.2,
    responseRate: 87,
    positivePercent: 78
  };

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 36 },
    { stars: 4, count: 76, percentage: 31 },
    { stars: 3, count: 45, percentage: 18 },
    { stars: 2, count: 25, percentage: 10 },
    { stars: 1, count: 13, percentage: 5 }
  ];

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesFilter = activeFilter === 'all' || feedback.status === activeFilter;
    const matchesSearch = feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRatingColor = (rating) => {
    if (rating >= 4) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (rating >= 3) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      responded: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return variants[status] || variants.pending;
  };

  const themeClasses = isDarkMode 
    ? 'bg-[#291c0e] text-white' 
    : 'bg-[#e1d4c2] text-[#291c0e]';

  const cardClasses = isDarkMode
    ? 'bg-[#6e473b] border-[#a78d78] text-white'
    : 'bg-white border-[#beb5a9] text-[#291c0e]';

  const accentClasses = isDarkMode
    ? 'bg-[#a78d78] text-[#291c0e]'
    : 'bg-[#6e473b] text-white';

  return (
    <CompanyLayout>
      <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
        {/* Header */}
        <div className="p-6 border-b border-opacity-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Customer Feedback</h1>
                <p className={`mt-1 ${isDarkMode ? 'text-[#beb5a9]' : 'text-[#6e473b]'}`}>
                  Monitor and manage customer feedback across all queues
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsDarkMode(!isDarkMode)}
                variant="outline"
                size="sm"
                className={`${isDarkMode ? 'border-[#a78d78] text-[#a78d78]' : 'border-[#6e473b] text-[#6e473b]'}`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </Button>
              <Button className={accentClasses}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className={cardClasses}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">Total Feedback</p>
                    <p className="text-3xl font-bold">{feedbackStats.totalFeedback}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">Average Rating</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-bold">{feedbackStats.avgRating}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(feedbackStats.avgRating) ? 'text-yellow-400 fill-yellow-400' : 'opacity-30'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Star className="w-8 h-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">Response Rate</p>
                    <p className="text-3xl font-bold">{feedbackStats.responseRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className={cardClasses}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-70">Positive Feedback</p>
                    <p className="text-3xl font-bold">{feedbackStats.positivePercent}%</p>
                  </div>
                  <ThumbsUp className="w-8 h-8 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rating Distribution */}
            <Card className={cardClasses}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Rating Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                      <span className="text-sm w-12 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <div className="lg:col-span-2 space-y-6">
              <Card className={cardClasses}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-50" />
                      <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                          isDarkMode ? 'bg-[#291c0e] border-[#a78d78]' : 'bg-white border-[#beb5a9]'
                        } focus:outline-none focus:ring-2 focus:ring-[#a78d78]`}
                      />
                    </div>
                    <div className="flex space-x-2">
                      {['all', 'pending', 'reviewed', 'responded'].map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          className={
                            activeFilter === filter 
                              ? accentClasses 
                              : `${isDarkMode ? 'border-[#a78d78] text-[#a78d78]' : 'border-[#6e473b] text-[#6e473b]'}`
                          }
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback List */}
              <div className="space-y-4">
                {filteredFeedback.map((feedback) => (
                  <Card key={feedback.id} className={`${cardClasses} transition-all duration-200 hover:shadow-lg`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${accentClasses}`}>
                            {feedback.customerName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{feedback.customerName}</h4>
                            <p className="text-sm opacity-70">{feedback.date} • {feedback.queueType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-yellow-400' : 'opacity-30'}`} 
                              />
                            ))}
                          </div>
                          <Badge className={getStatusBadge(feedback.status)}>
                            {feedback.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {feedback.category}
                          </Badge>
                          <span className="text-sm opacity-70">Wait Time: {feedback.waitTime}</span>
                        </div>
                        <p className="text-sm leading-relaxed opacity-90">{feedback.message}</p>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" className={`${isDarkMode ? 'border-[#a78d78]' : 'border-[#6e473b]'}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {feedback.status === 'pending' && (
                          <Button size="sm" className={accentClasses}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Respond
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFeedback.length === 0 && (
                <Card className={cardClasses}>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto opacity-30 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
                    <p className="opacity-70">Try adjusting your search terms or filters.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
}
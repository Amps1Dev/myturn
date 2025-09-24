"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Sun,
  Moon,
} from "lucide-react";
import { ClientLayout } from "@/components/client-layout";

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // Load saved mode on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle mode and save preference
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", newMode.toString());
      return newMode;
    });
  };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: "queue-alert",
      title: "High Traffic Predicted",
      message:
        "Zambia National Commercial Bank is expected to be busy tomorrow between 10:00 - 14:00.",
      time: "2h ago",
      company: "Zambia National Commercial Bank",
      location: "Cairo Road, Lusaka",
      read: false,
    },
    {
      id: 2,
      type: "replacement",
      title: "Queue Update",
      message:
        "Your position has been updated. Someone closer has been moved ahead of you in the queue.",
      time: "4h ago",
      company: "University Teaching Hospital",
      location: "Nationalist Road, Lusaka",
      read: true,
    },
    {
      id: 3,
      type: "turn-notice",
      title: "It's Almost Your Turn",
      message:
        "Please head to Shoprite Customer Service, your service slot will be ready soon.",
      time: "1d ago",
      company: "Shoprite Customer Service",
      location: "Manda Hill Mall, Lusaka",
      read: false,
    },
  ];

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || notif.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getNotificationIcon = (type: any) => {
    switch (type) {
      case "queue-alert":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "replacement":
        return <Clock className="w-5 h-5 text-[#6e473b] dark:text-[#a78d78]" />;
      case "turn-notice":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-[#6e473b] dark:text-[#a78d78]" />;
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 transition-colors duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
              Notifications
            </h1>
            <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
              Stay updated with queue predictions and activity alerts
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3 items-center">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-[#beb5a9] bg-white text-[#291c0e] dark:bg-[#291c0e] dark:text-[#e1d4c2] 
                         placeholder-gray-500 focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition hover:shadow-md cursor-pointer 
                ${notif.read
                  ? "bg-white border-[#beb5a9] dark:bg-[#291c0e] dark:border-[#6e473b]"
                  : "bg-[#e1d4c2] border-[#a78d78] dark:bg-[#6e473b] dark:border-[#a78d78]"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                      {notif.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-sm text-[#6e473b] dark:text-[#beb5a9] mt-1">
                    {notif.message}
                  </p>
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {notif.company} - {notif.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 mx-auto text-[#6e473b] dark:text-[#beb5a9] mb-4" />
            <h3 className="text-lg font-medium text-[#291c0e] dark:text-[#e1d4c2]">
              No Notifications
            </h3>
            <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default NotificationsPage;

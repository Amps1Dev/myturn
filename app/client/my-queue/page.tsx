
"use client";

import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function MyQueuesPage() {
  const [queues, setQueues] = useState([
    {
      id: 1,
      company: "HealthCare Clinic",
      status: "Upcoming",
      time: "Tomorrow, 10:30 AM",
      location: "Main Street Branch",
    },
    {
      id: 2,
      company: "National Bank",
      status: "Completed",
      time: "Yesterday, 2:00 PM",
      location: "City Center Branch",
    },
    {
      id: 3,
      company: "ZamPost",
      status: "Upcoming",
      time: "Monday, 11:00 AM",
      location: "Downtown Branch",
    },
    {
      id: 4,
      company: "Immigration Office",
      status: "Cancelled",
      time: "Last Friday, 9:00 AM",
      location: "Central Branch",
    },
  ]);

  const bookedCount = queues.filter((q) => q.status !== "Cancelled").length;
  const cancelledCount = queues.filter((q) => q.status === "Cancelled").length;

  return (
    <ClientLayout>
      <div
        className={`${roboto.className} min-h-screen transition-colors duration-300 
        bg-[#e1d4c2] text-[#291c0e] 
        dark:bg-[#291c0e] dark:text-[#e1d4c2] p-6`}
      >
        <h1 className="text-3xl font-bold mb-6">My Queues</h1>

        {/* Stats Summary */}
        <div className="flex gap-6 mb-8">
          <Card className="flex-1 rounded-xl border border-[#beb5a9] bg-[#fdfcfb] dark:bg-[#6e473b]/40">
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Total Booked</h2>
              <p className="text-2xl font-bold">{bookedCount}</p>
            </CardContent>
          </Card>
          <Card className="flex-1 rounded-xl border border-[#beb5a9] bg-[#fdfcfb] dark:bg-[#6e473b]/40">
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-semibold">Cancelled</h2>
              <p className="text-2xl font-bold">{cancelledCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Queues List */}
        {queues.length === 0 ? (
          <p className="text-lg text-center text-[#6e473b] dark:text-[#beb5a9]">
            You haven’t booked any queues yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {queues.map((q) => (
              <Card
                key={q.id}
                className="shadow-lg rounded-2xl border border-[#beb5a9] 
                bg-[#fdfcfb] dark:bg-[#6e473b]/40"
              >
                <CardContent className="p-6 space-y-3">
                  <h2 className="text-xl font-semibold">{q.company}</h2>
                  <p className="text-sm">Location: {q.location}</p>
                  <p className="text-sm">Time: {q.time}</p>
                  <Badge
                    className={`${
                      q.status === "Upcoming"
                        ? "bg-green-600"
                        : q.status === "Cancelled"
                        ? "bg-red-600"
                        : "bg-gray-500"
                    } text-white`}
                  >s
                    {q.status}
                  </Badge>

                  <div className="flex flex-wrap gap-3 pt-3">
                    {q.status === "Upcoming" && (
                      <>
                        <Button className="bg-[#6e473b] hover:bg-[#291c0e] text-white rounded-xl">
                          Cancel
                        </Button>
                        <Button className="bg-[#a78d78] hover:bg-[#6e473b] text-white rounded-xl">
                          Gift Slot
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      className="border-[#6e473b] text-[#6e473b] 
                      dark:text-[#e1d4c2] dark:border-[#e1d4c2] rounded-xl"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ClientLayout>
  );
}

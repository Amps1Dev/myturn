"use client";
import { useState } from "react";
import { 
  Clock, 
  MapPin, 
  Users, 
  Gift, 
  X, 
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Star,
  ChevronRight,
  Heart,
  UserPlus,
  Share2
} from "lucide-react";
import { ClientLayout } from "@/components/client-layout";

interface QueueSlot {
  id: number;
  companyName: string;
  companyLocation: string;
  service: string;
  reason: string;
  bookedAt: string;
  estimatedTime: string;
  position: number;
  totalInQueue: number;
  status: "Active" | "Called" | "Missed" | "Completed";
  companyPhone: string;
  rating: number;
}

interface GiftModal {
  isOpen: boolean;
  slot: QueueSlot | null;
  giftType: "next" | "specific" | null;
}

const MyQueueSlotsPage = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [giftModal, setGiftModal] = useState<GiftModal>({
    isOpen: false,
    slot: null,
    giftType: null
  });
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [isGifting, setIsGifting] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState(false);

  const queueSlots: QueueSlot[] = [
    {
      id: 1,
      companyName: "Zanaco Bank",
      companyLocation: "Cairo Road, Lusaka",
      service: "Account Opening",
      reason: "Need to open a new savings account for my business",
      bookedAt: "2024-01-15T09:30:00",
      estimatedTime: "10:45 AM",
      position: 3,
      totalInQueue: 12,
      status: "Active",
      companyPhone: "+260 211 229229",
      rating: 4.3
    },
    {
      id: 2,
      companyName: "MTN Service Center",
      companyLocation: "Manda Hill Mall, Lusaka",
      service: "SIM Replacement",
      reason: "Lost my SIM card and need a replacement",
      bookedAt: "2024-01-15T14:00:00",
      estimatedTime: "2:30 PM",
      position: 1,
      totalInQueue: 6,
      status: "Called",
      companyPhone: "+260 955 000000",
      rating: 4.0
    },
    {
      id: 3,
      companyName: "University Teaching Hospital",
      companyLocation: "Nationalist Road, Lusaka",
      service: "General Consultation",
      reason: "Regular checkup and follow-up on previous visit",
      bookedAt: "2024-01-14T08:00:00",
      estimatedTime: "11:30 AM",
      position: 8,
      totalInQueue: 45,
      status: "Active",
      companyPhone: "+260 211 254598",
      rating: 4.1
    }
  ];

  const historySlots: QueueSlot[] = [
    {
      id: 4,
      companyName: "ZESCO Customer Service",
      companyLocation: "Electra House, Lusaka",
      service: "Bill Payment",
      reason: "Pay outstanding electricity bill",
      bookedAt: "2024-01-10T11:00:00",
      estimatedTime: "Completed",
      position: 0,
      totalInQueue: 0,
      status: "Completed",
      companyPhone: "+260 211 251015",
      rating: 3.8
    },
    {
      id: 5,
      companyName: "FNB Zambia",
      companyLocation: "Findeco House, Cairo Road",
      service: "Account Services",
      reason: "Update my contact information",
      bookedAt: "2024-01-08T13:30:00",
      estimatedTime: "Missed",
      position: 0,
      totalInQueue: 0,
      status: "Missed",
      companyPhone: "+260 211 366700",
      rating: 4.4
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "Called":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "Missed":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  const getPositionColor = (position: number, total: number) => {
    const percentage = position / total;
    if (percentage <= 0.3) return "text-green-600 dark:text-green-400";
    if (percentage <= 0.6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const openGiftModal = (slot: QueueSlot, giftType: "next" | "specific") => {
    setGiftModal({ isOpen: true, slot, giftType });
    setRecipientPhone("");
    setGiftMessage("");
    setGiftSuccess(false);
  };

  const closeGiftModal = () => {
    setGiftModal({ isOpen: false, slot: null, giftType: null });
    setRecipientPhone("");
    setGiftMessage("");
    setIsGifting(false);
    setGiftSuccess(false);
  };

  const handleGift = async () => {
    if (giftModal.giftType === "specific" && !recipientPhone.trim()) return;
    
    setIsGifting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGifting(false);
      setGiftSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        closeGiftModal();
      }, 2000);
    }, 1500);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentSlots = activeTab === "active" 
    ? queueSlots.filter(slot => slot.status === "Active" || slot.status === "Called")
    : historySlots;

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e] transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
              My Queue Slots
            </h1>
            <p className="text-[#6e473b] dark:text-[#beb5a9]">
              Manage your active bookings and view your queue history
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-[#beb5a9]/30 dark:bg-[#6e473b]/30 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "active"
                  ? "bg-white dark:bg-[#6e473b] text-[#291c0e] dark:text-[#e1d4c2] shadow-sm"
                  : "text-[#6e473b] dark:text-[#beb5a9] hover:text-[#291c0e] dark:hover:text-[#e1d4c2]"
              }`}
            >
              Active Slots ({queueSlots.filter(slot => slot.status === "Active" || slot.status === "Called").length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-white dark:bg-[#6e473b] text-[#291c0e] dark:text-[#e1d4c2] shadow-sm"
                  : "text-[#6e473b] dark:text-[#beb5a9] hover:text-[#291c0e] dark:hover:text-[#e1d4c2]"
              }`}
            >
              History ({historySlots.length})
            </button>
          </div>

          {/* Slots Grid */}
          <div className="space-y-6">
            {currentSlots.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#beb5a9]/30 dark:bg-[#6e473b]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#6e473b] dark:text-[#beb5a9]" />
                </div>
                <h3 className="text-xl font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                  No {activeTab} slots
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9]">
                  {activeTab === "active" 
                    ? "You don't have any active bookings at the moment"
                    : "Your completed and missed appointments will appear here"
                  }
                </p>
              </div>
            ) : (
              currentSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white dark:bg-[#6e473b]/40 rounded-xl border border-[#beb5a9] dark:border-[#6e473b] shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ borderRadius: '16px' }}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                            {slot.companyName}
                          </h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm text-[#6e473b] dark:text-[#beb5a9]">
                              {slot.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-[#6e473b] dark:text-[#beb5a9] mb-2">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{slot.companyLocation}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                        {activeTab === "active" && (
                          <div className="text-right">
                            <div className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                              Expected at
                            </div>
                            <div className="font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                              {slot.estimatedTime}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="bg-[#e1d4c2] dark:bg-[#291c0e]/50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">Service:</span>
                          <div className="font-medium text-[#291c0e] dark:text-[#e1d4c2]">
                            {slot.service}
                          </div>
                        </div>
                        {activeTab === "active" && (
                          <div className="text-right">
                            <div className="text-sm text-[#6e473b] dark:text-[#beb5a9]">Position</div>
                            <div className={`font-bold text-lg ${getPositionColor(slot.position, slot.totalInQueue)}`}>
                              {slot.position} of {slot.totalInQueue}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">Reason:</span>
                        <div className="text-sm text-[#291c0e] dark:text-[#e1d4c2] mt-1">
                          {slot.reason}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex justify-between items-center text-sm text-[#6e473b] dark:text-[#beb5a9] mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Booked: {formatDate(slot.bookedAt)} at {formatTime(slot.bookedAt)}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {slot.companyPhone}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {activeTab === "active" && slot.status !== "Called" && (
                    <div className="px-6 pb-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openGiftModal(slot, "next")}
                          className="flex-1 bg-[#a78d78] hover:bg-[#6e473b] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          Gift to Next Person
                        </button>
                        <button
                          onClick={() => openGiftModal(slot, "specific")}
                          className="flex-1 bg-[#6e473b] hover:bg-[#a78d78] text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Gift to Someone
                        </button>
                      </div>
                    </div>
                  )}

                  {slot.status === "Called" && (
                    <div className="px-6 pb-6">
                      <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <div className="font-medium text-green-800 dark:text-green-300">
                            You're being called!
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            Please proceed to the service counter
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Gift Modal */}
        {giftModal.isOpen && giftModal.slot && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#291c0e] rounded-xl max-w-md w-full border border-[#beb5a9] dark:border-[#6e473b]">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#beb5a9] dark:border-[#6e473b]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#a78d78]/20 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-[#a78d78]" />
                  </div>
                  <h2 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                    Gift Your Slot
                  </h2>
                </div>
                <button
                  onClick={closeGiftModal}
                  className="text-[#6e473b] dark:text-[#beb5a9] hover:text-[#291c0e] dark:hover:text-[#e1d4c2]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {giftSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                    Slot Gifted Successfully!
                  </h3>
                  <p className="text-[#6e473b] dark:text-[#beb5a9] text-sm">
                    {giftModal.giftType === "next" 
                      ? "Your slot has been given to the next person in line"
                      : `Your slot has been sent to the specified recipient`
                    }
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Slot Info */}
                  <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-1">
                      {giftModal.slot.companyName}
                    </h3>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9] mb-1">
                      Service: {giftModal.slot.service}
                    </p>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      Position: #{giftModal.slot.position} of {giftModal.slot.totalInQueue}
                    </p>
                  </div>

                  {/* Gift Type Info */}
                  <div className="flex items-center gap-3 p-3 bg-[#a78d78]/10 rounded-lg">
                    {giftModal.giftType === "next" ? (
                      <>
                        <ChevronRight className="w-5 h-5 text-[#a78d78]" />
                        <span className="text-sm text-[#291c0e] dark:text-[#e1d4c2]">
                          Gift to the next person in line
                        </span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 text-[#a78d78]" />
                        <span className="text-sm text-[#291c0e] dark:text-[#e1d4c2]">
                          Gift to a specific person
                        </span>
                      </>
                    )}
                  </div>

                  {/* Recipient Phone (for specific gifting) */}
                  {giftModal.giftType === "specific" && (
                    <div>
                      <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                        Recipient's Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="+260 XXX XXX XXX"
                        className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
                        bg-white dark:bg-[#6e473b]/30 
                        text-[#291c0e] dark:text-[#e1d4c2]
                        placeholder-[#6e473b] dark:placeholder-[#beb5a9]
                        focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Optional Message */}
                  <div>
                    <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Add a nice message with your gift..."
                      rows={3}
                      className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
                      bg-white dark:bg-[#6e473b]/30 
                      text-[#291c0e] dark:text-[#e1d4c2]
                      placeholder-[#6e473b] dark:placeholder-[#beb5a9]
                      focus:ring-2 focus:ring-[#a78d78] focus:border-transparent
                      resize-none"
                    />
                  </div>

                  {/* Gift Button */}
                  <button
                    onClick={handleGift}
                    disabled={
                      (giftModal.giftType === "specific" && !recipientPhone.trim()) || 
                      isGifting
                    }
                    className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
                    bg-[#a78d78] hover:bg-[#6e473b] disabled:bg-[#beb5a9] disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                  >
                    {isGifting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Gifting...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        {giftModal.giftType === "next" ? "Gift to Next Person" : "Send Gift"}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default MyQueueSlotsPage;
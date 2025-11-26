"use client";
import { useState, useEffect } from "react";
import { 
  Clock, 
  MapPin, 
  Users, 
  Gift, 
  X, 
  CheckCircle,
  Calendar,
  Phone,
  Star,
  ChevronRight,
  Heart,
  UserPlus,
  Share2,
  Loader2
} from "lucide-react";
import { ClientLayout } from "@/components/client-layout";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

interface QueueSlot {
  id: string;
  queue_number: number;
  status: string;
  service_type: string;
  estimated_wait_time: number;
  joined_at: string;
  completed_at?: string;
  institution: {
    name: string;
    location: string;
    phone: string;
    rating: number;
  };
  branch: {
    name: string;
    address: string;
  };
}

interface GiftModal {
  isOpen: boolean;
  slot: QueueSlot | null;
  giftType: "next" | "specific" | null;
}

const MyQueueSlotsPage = () => {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [activeSlots, setActiveSlots] = useState<QueueSlot[]>([]);
  const [historySlots, setHistorySlots] = useState<QueueSlot[]>([]);
  const [giftModal, setGiftModal] = useState<GiftModal>({
    isOpen: false,
    slot: null,
    giftType: null
  });
  const [recipientPhone, setRecipientPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [isGifting, setIsGifting] = useState(false);
  const [giftSuccess, setGiftSuccess] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  // Load queue slots
  useEffect(() => {
    if (!userId) return;

    const loadSlots = async () => {
      setLoading(true);

      // Load active slots
      const { data: active, error: activeError } = await supabase
        .from('queue_entries')
        .select(`
          *,
          institution:institutions(name, location, phone, rating),
          branch:branches(name, address)
        `)
        .eq('user_id', userId)
        .in('status', ['waiting', 'called'])
        .order('joined_at', { ascending: false });

      if (!activeError && active) {
        setActiveSlots(active as any);
      }

      // Load history slots
      const { data: history, error: historyError } = await supabase
        .from('queue_entries')
        .select(`
          *,
          institution:institutions(name, location, phone, rating),
          branch:branches(name, address)
        `)
        .eq('user_id', userId)
        .in('status', ['served', 'cancelled', 'no_show'])
        .order('completed_at', { ascending: false })
        .limit(20);

      if (!historyError && history) {
        setHistorySlots(history as any);
      }

      setLoading(false);
    };

    loadSlots();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('user_queue_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_entries',
          filter: `user_id=eq.${userId}`
        },
        () => {
          loadSlots();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "called":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "served":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "cancelled":
      case "no_show":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
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
    
    // TODO: Implement gifting logic
    setTimeout(() => {
      setIsGifting(false);
      setGiftSuccess(true);
      toast.success("Queue slot gifted successfully");
      
      setTimeout(() => {
        closeGiftModal();
      }, 2000);
    }, 1500);
  };

  const handleCancelSlot = async (slotId: string) => {
    const { error } = await supabase
      .from('queue_entries')
      .update({ status: 'cancelled' })
      .eq('id', slotId);

    if (error) {
      toast.error("Failed to cancel slot");
    } else {
      toast.success("Slot cancelled successfully");
    }
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

  const currentSlots = activeTab === "active" ? activeSlots : historySlots;

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e]">
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
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === "active"
                  ? "bg-white dark:bg-[#6e473b] text-[#291c0e] dark:text-[#e1d4c2] shadow-sm"
                  : "text-[#6e473b] dark:text-[#beb5a9]"
              }`}
            >
              Active Slots ({activeSlots.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                activeTab === "history"
                  ? "bg-white dark:bg-[#6e473b] text-[#291c0e] dark:text-[#e1d4c2] shadow-sm"
                  : "text-[#6e473b] dark:text-[#beb5a9]"
              }`}
            >
              History ({historySlots.length})
            </button>
          </div>

          {/* Slots Grid */}
          <div className="space-y-6">
            {currentSlots.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-[#6e473b] dark:text-[#beb5a9] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                  No {activeTab} slots
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9]">
                  {activeTab === "active" 
                    ? "You don't have any active bookings at the moment"
                    : "Your completed and cancelled appointments will appear here"
                  }
                </p>
              </div>
            ) : (
              currentSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white dark:bg-[#6e473b]/40 rounded-xl border border-[#beb5a9] dark:border-[#6e473b] shadow-lg"
                >
                  <div className="p-6 pb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                            {slot.institution?.name}
                          </h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="ml-1 text-sm text-[#6e473b] dark:text-[#beb5a9]">
                              {slot.institution?.rating || 0}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-[#6e473b] dark:text-[#beb5a9] mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{slot.institution?.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(slot.status)}`}>
                          {slot.status}
                        </span>
                        {activeTab === "active" && (
                          <div className="text-right">
                            <div className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                              Queue Number
                            </div>
                            <div className="font-semibold text-[#291c0e] dark:text-[#e1d4c2]">
                              #{slot.queue_number}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#e1d4c2] dark:bg-[#291c0e]/50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">Service:</span>
                          <div className="font-medium text-[#291c0e] dark:text-[#e1d4c2]">
                            {slot.service_type || 'General Service'}
                          </div>
                        </div>
                        {activeTab === "active" && (
                          <div className="text-right">
                            <div className="text-sm text-[#6e473b] dark:text-[#beb5a9]">Est. Wait</div>
                            <div className="font-bold text-lg text-[#291c0e] dark:text-[#e1d4c2]">
                              {slot.estimated_wait_time} mins
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-[#6e473b] dark:text-[#beb5a9] mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined: {formatDate(slot.joined_at)} at {formatTime(slot.joined_at)}
                      </div>
                      {slot.institution?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {slot.institution.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {activeTab === "active" && slot.status === "waiting" && (
                    <div className="px-6 pb-6">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openGiftModal(slot, "next")}
                          className="flex-1 bg-[#a78d78] hover:bg-[#6e473b] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          Gift to Next Person
                        </button>
                        <button
                          onClick={() => handleCancelSlot(slot.id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {slot.status === "called" && (
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
                  className="text-[#6e473b] dark:text-[#beb5a9]"
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
                    Your slot has been transferred
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-1">
                      {giftModal.slot.institution?.name}
                    </h3>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      Queue Number: #{giftModal.slot.queue_number}
                    </p>
                  </div>

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
                        bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2]"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleGift}
                    disabled={isGifting}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-[#a78d78] hover:bg-[#6e473b] disabled:bg-[#beb5a9] flex items-center justify-center gap-2"
                  >
                    {isGifting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Gifting...
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        Send Gift
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
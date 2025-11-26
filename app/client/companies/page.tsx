"use client";
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  X,
  Check,
  ChevronRight,
  Loader2
} from "lucide-react";
import { ClientLayout } from "@/components/client-layout";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

interface Institution {
  id: string;
  name: string;
  category: string;
  status: string;
  rating: number;
  location: string;
  phone: string;
  current_queue_count: number;
  estimated_wait_time: number;
  services: string[];
  operating_hours: any;
  branch_id: string;
}

interface BookingModal {
  isOpen: boolean;
  institution: Institution | null;
}

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [bookingModal, setBookingModal] = useState<BookingModal>({
    isOpen: false,
    institution: null
  });
  const [selectedService, setSelectedService] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Load institutions
  useEffect(() => {
    const loadInstitutions = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast.error("Failed to load institutions");
        setLoading(false);
        return;
      }

      setInstitutions(data || []);

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(data?.map(i => i.category) || [])];
      setCategories(uniqueCategories);

      setLoading(false);
    };

    loadInstitutions();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('institutions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'institutions'
        },
        () => {
          loadInstitutions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || institution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "closed":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "busy":
      case "break":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getQueueColor = (length: number) => {
    if (length <= 5) return "text-green-600 dark:text-green-400";
    if (length <= 15) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const openBookingModal = (institution: Institution) => {
    if (institution.status === "closed") return;
    setBookingModal({ isOpen: true, institution });
    setSelectedService("");
    setBookingReason("");
    setBookingSuccess(false);
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, institution: null });
    setSelectedService("");
    setBookingReason("");
    setIsSubmitting(false);
    setBookingSuccess(false);
  };

  const handleBooking = async () => {
    if (!selectedService || !bookingReason.trim() || !bookingModal.institution) return;
    if (!userId) {
      toast.error("Please sign in to book a slot");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the next queue number for this branch
      const { data: lastQueue } = await supabase
        .from('queue_entries')
        .select('queue_number')
        .eq('branch_id', bookingModal.institution.branch_id)
        .order('queue_number', { ascending: false })
        .limit(1)
        .single();

      const nextQueueNumber = (lastQueue?.queue_number || 0) + 1;

      // Create queue entry
      const { error } = await supabase
        .from('queue_entries')
        .insert({
          user_id: userId,
          institution_id: bookingModal.institution.id,
          branch_id: bookingModal.institution.branch_id,
          queue_number: nextQueueNumber,
          service_type: selectedService,
          notes: bookingReason,
          status: 'waiting',
          estimated_wait_time: bookingModal.institution.estimated_wait_time
        });

      if (error) throw error;

      setBookingSuccess(true);
      toast.success("Booking successful!");

      setTimeout(() => {
        closeBookingModal();
      }, 2000);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error("Failed to book slot");
      setIsSubmitting(false);
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
              Book a Service Slot
            </h1>
            <p className="text-[#6e473b] dark:text-[#beb5a9]">
              Find and book appointments with institutions across Zambia
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search institutions or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[#beb5a9] 
                bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2] 
                focus:ring-2 focus:ring-[#a78d78]"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border border-[#beb5a9] 
                bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstitutions.map((institution) => (
              <div
                key={institution.id}
                className="rounded-xl shadow-lg border border-[#beb5a9] dark:border-[#6e473b]
                bg-white dark:bg-[#6e473b]/40 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => openBookingModal(institution)}
              >
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                        {institution.name}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#a78d78] text-white">
                        {institution.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(institution.status)}`}>
                        {institution.status}
                      </span>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm text-[#6e473b] dark:text-[#beb5a9]">
                          {institution.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#e1d4c2] dark:bg-[#291c0e]/50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                        <span className={`font-medium ${getQueueColor(institution.current_queue_count)}`}>
                          {institution.current_queue_count} in queue
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                        <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                          {institution.estimated_wait_time} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4 space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                    <span className="text-sm text-[#6e473b] dark:text-[#beb5a9] truncate">
                      {institution.location}
                    </span>
                  </div>
                  {institution.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                      <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                        {institution.phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6">
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                      institution.status === "closed"
                        ? "bg-[#beb5a9] cursor-not-allowed"
                        : "bg-[#6e473b] hover:bg-[#a78d78]"
                    }`}
                    disabled={institution.status === "closed"}
                  >
                    <Calendar className="w-4 h-4" />
                    {institution.status === "closed" ? "Closed" : "Book Slot"}
                    {institution.status !== "closed" && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                No institutions found
              </h3>
              <p className="text-[#6e473b] dark:text-[#beb5a9]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {bookingModal.isOpen && bookingModal.institution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#291c0e] rounded-xl max-w-md w-full border border-[#beb5a9] dark:border-[#6e473b]">
              <div className="flex justify-between items-center p-6 border-b border-[#beb5a9] dark:border-[#6e473b]">
                <h2 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                  Book Appointment
                </h2>
                <button
                  onClick={closeBookingModal}
                  className="text-[#6e473b] dark:text-[#beb5a9]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                    Booking Successful!
                  </h3>
                  <p className="text-[#6e473b] dark:text-[#beb5a9] text-sm">
                    Your slot has been booked at {bookingModal.institution.name}
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-1">
                      {bookingModal.institution.name}
                    </h3>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      {bookingModal.institution.location}
                    </p>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9] mt-1">
                      Current wait: {bookingModal.institution.estimated_wait_time} min
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                      Select Service *
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
                      bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2]"
                    >
                      <option value="">Choose a service...</option>
                      {(bookingModal.institution.services || []).map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                      Reason for Visit *
                    </label>
                    <textarea
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      placeholder="Please explain why you need this service..."
                      rows={3}
                      className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
                      bg-white dark:bg-[#6e473b]/30 text-[#291c0e] dark:text-[#e1d4c2] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!selectedService || !bookingReason.trim() || isSubmitting}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white
                    bg-[#6e473b] hover:bg-[#a78d78] disabled:bg-[#beb5a9]
                    flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        Confirm Booking
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

export default CompaniesPage;
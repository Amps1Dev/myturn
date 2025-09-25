"use client";
import { useState } from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star, 
  Users, 
  Calendar,
  MessageSquare,
  X,
  Check,
  ChevronRight
} from "lucide-react";
import { ClientLayout } from "@/components/client-layout";

interface Company {
  id: number;
  name: string;
  category: string;
  status: "Open" | "Closed" | "Break";
  rating: number;
  location: string;
  phone: string;
  hours: string;
  queueLength: number;
  estimatedWait: string;
  services: string[];
}

interface BookingModal {
  isOpen: boolean;
  company: Company | null;
}

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookingModal, setBookingModal] = useState<BookingModal>({
    isOpen: false,
    company: null
  });
  const [selectedService, setSelectedService] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const companies: Company[] = [
    {
      id: 1,
      name: "Zanaco Bank",
      category: "Banking",
      status: "Open",
      rating: 4.3,
      location: "Cairo Road, Lusaka",
      phone: "+260 211 229229",
      hours: "Mon–Fri: 8:00am–4:30pm",
      queueLength: 12,
      estimatedWait: "25 mins",
      services: ["Account Opening", "Loans", "Forex Exchange", "General Banking"]
    },
    {
      id: 2,
      name: "University Teaching Hospital",
      category: "Healthcare",
      status: "Open",
      rating: 4.1,
      location: "Nationalist Road, Lusaka",
      phone: "+260 211 254598",
      hours: "24/7 Emergency, Outpatient: 8am–5pm",
      queueLength: 45,
      estimatedWait: "2 hours",
      services: ["General Consultation", "Specialist Appointment", "Laboratory Tests", "X-Ray/Imaging"]
    },
    {
      id: 3,
      name: "ZESCO Customer Service",
      category: "Utilities",
      status: "Open",
      rating: 3.8,
      location: "Electra House, Lusaka",
      phone: "+260 211 251015",
      hours: "Mon–Fri: 8:00am–5:00pm",
      queueLength: 8,
      estimatedWait: "15 mins",
      services: ["Bill Payment", "New Connection", "Fault Reporting", "Meter Reading"]
    },
    {
      id: 4,
      name: "MTN Service Center",
      category: "Telecommunications",
      status: "Open",
      rating: 4.0,
      location: "Manda Hill Mall, Lusaka",
      phone: "+260 955 000000",
      hours: "Mon–Sat: 8:30am–6:00pm",
      queueLength: 6,
      estimatedWait: "12 mins",
      services: ["SIM Replacement", "Device Support", "Bill Payment", "New Registration"]
    },
    {
      id: 5,
      name: "National Registration Office",
      category: "Government",
      status: "Open",
      rating: 3.2,
      location: "Haile Selassie Avenue, Lusaka",
      phone: "+260 211 251777",
      hours: "Mon–Fri: 8:00am–4:30pm",
      queueLength: 32,
      estimatedWait: "1.5 hours",
      services: ["National ID Application", "Passport Application", "Certificate Collection", "Document Verification"]
    },
    {
      id: 6,
      name: "Shoprite Manda Hill",
      category: "Retail",
      status: "Open",
      rating: 4.2,
      location: "Manda Hill Shopping Mall, Lusaka",
      phone: "+260 211 252366",
      hours: "Mon–Sun: 8:00am–9:00pm",
      queueLength: 4,
      estimatedWait: "8 mins",
      services: ["Money Transfer", "Customer Service", "Product Returns", "Gift Cards"]
    },
    {
      id: 7,
      name: "FNB Zambia",
      category: "Banking",
      status: "Closed",
      rating: 4.4,
      location: "Findeco House, Cairo Road",
      phone: "+260 211 366700",
      hours: "Mon–Fri: 8:30am–4:00pm",
      queueLength: 0,
      estimatedWait: "Closed",
      services: ["Account Services", "Business Banking", "Investment Services", "Card Services"]
    },
    {
      id: 8,
      name: "Levy Mwanawasa Hospital",
      category: "Healthcare",
      status: "Open",
      rating: 4.0,
      location: "Great North Road, Lusaka",
      phone: "+260 211 848000",
      hours: "Mon–Fri: 7:30am–4:30pm",
      queueLength: 23,
      estimatedWait: "45 mins",
      services: ["Outpatient Consultation", "Maternity Services", "Pediatric Care", "Emergency Services"]
    }
  ];

  const categories = [
    "All",
    "Banking",
    "Healthcare",
    "Government",
    "Telecommunications",
    "Utilities",
    "Retail"
  ];

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "Closed":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "Break":
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

  const openBookingModal = (company: Company) => {
    if (company.status === "Closed") return;
    setBookingModal({ isOpen: true, company });
    setSelectedService("");
    setBookingReason("");
    setBookingSuccess(false);
  };

  const closeBookingModal = () => {
    setBookingModal({ isOpen: false, company: null });
    setSelectedService("");
    setBookingReason("");
    setIsSubmitting(false);
    setBookingSuccess(false);
  };

  const handleBooking = async () => {
    if (!selectedService || !bookingReason.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      
      // Auto close after 2 seconds
      setTimeout(() => {
        closeBookingModal();
      }, 2000);
    }, 1500);
  };

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
              Book a Service Slot
            </h1>
            <p className="text-[#6e473b] dark:text-[#beb5a9]">
              Find and book appointments with companies across Zambia
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search companies or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[#beb5a9] 
                bg-white dark:bg-[#6e473b]/30 
                text-[#291c0e] dark:text-[#e1d4c2] 
                placeholder-[#6e473b] dark:placeholder-[#beb5a9]
                focus:ring-2 focus:ring-[#a78d78] focus:border-transparent
                transition-all duration-200"
                style={{ borderRadius: '8px' }}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-lg border border-[#beb5a9] 
                bg-white dark:bg-[#6e473b]/30 
                text-[#291c0e] dark:text-[#e1d4c2] 
                focus:ring-2 focus:ring-[#a78d78] focus:border-transparent
                transition-all duration-200"
                style={{ borderRadius: '8px' }}
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-white dark:bg-[#6e473b]">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="rounded-xl shadow-lg border border-[#beb5a9] dark:border-[#6e473b]
                bg-white dark:bg-[#6e473b]/40 
                hover:shadow-xl transition-all duration-300 overflow-hidden
                hover:border-[#a78d78] cursor-pointer"
                onClick={() => openBookingModal(company)}
                style={{ borderRadius: '12px' }}
              >
                <div className="p-6 pb-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                        {company.name}
                      </h3>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#a78d78] text-white">
                        {company.category}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(company.status)}`}>
                        {company.status}
                      </span>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm text-[#6e473b] dark:text-[#beb5a9]">
                          {company.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Queue Info */}
                  <div className="bg-[#e1d4c2] dark:bg-[#291c0e]/50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                        <span className={`font-medium ${getQueueColor(company.queueLength)}`}>
                          {company.queueLength} in queue
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2" />
                        <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                          {company.estimatedWait}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location and Contact */}
                <div className="px-6 pb-4 space-y-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2 flex-shrink-0" />
                    <span className="text-sm text-[#6e473b] dark:text-[#beb5a9] truncate">
                      {company.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2 flex-shrink-0" />
                    <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      {company.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-[#6e473b] dark:text-[#beb5a9] mr-2 flex-shrink-0" />
                    <span className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      {company.hours}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <div className="px-6 pb-6">
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                      company.status === "Closed"
                        ? "bg-[#beb5a9] cursor-not-allowed"
                        : "bg-[#6e473b] hover:bg-[#a78d78] active:transform active:scale-98"
                    }`}
                    disabled={company.status === "Closed"}
                  >
                    <Calendar className="w-4 h-4" />
                    {company.status === "Closed" ? "Closed" : "Book Slot"}
                    {company.status !== "Closed" && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                No companies found
              </h3>
              <p className="text-[#6e473b] dark:text-[#beb5a9]">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {bookingModal.isOpen && bookingModal.company && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-[#291c0e] rounded-xl max-w-md w-full border border-[#beb5a9] dark:border-[#6e473b]">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#beb5a9] dark:border-[#6e473b]">
                <h2 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2]">
                  Book Appointment
                </h2>
                <button
                  onClick={closeBookingModal}
                  className="text-[#6e473b] dark:text-[#beb5a9] hover:text-[#291c0e] dark:hover:text-[#e1d4c2]"
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
                    Your slot has been booked at {bookingModal.company.name}
                  </p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Company Info */}
                  <div className="bg-[#e1d4c2] dark:bg-[#6e473b]/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-1">
                      {bookingModal.company.name}
                    </h3>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9]">
                      {bookingModal.company.location}
                    </p>
                    <p className="text-sm text-[#6e473b] dark:text-[#beb5a9] mt-1">
                      Current wait: {bookingModal.company.estimatedWait}
                    </p>
                  </div>

                  {/* Service Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2">
                      Select Service *
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full p-3 border border-[#beb5a9] dark:border-[#6e473b] rounded-lg
                      bg-white dark:bg-[#6e473b]/30 
                      text-[#291c0e] dark:text-[#e1d4c2]
                      focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
                    >
                      <option value="">Choose a service...</option>
                      {bookingModal.company.services.map((service) => (
                        <option key={service} value={service} className="bg-white dark:bg-[#6e473b]">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reason for Visit */}
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
                      bg-white dark:bg-[#6e473b]/30 
                      text-[#291c0e] dark:text-[#e1d4c2]
                      placeholder-[#6e473b] dark:placeholder-[#beb5a9]
                      focus:ring-2 focus:ring-[#a78d78] focus:border-transparent
                      resize-none"
                    />
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={handleBooking}
                    disabled={!selectedService || !bookingReason.trim() || isSubmitting}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200
                    bg-[#6e473b] hover:bg-[#a78d78] disabled:bg-[#beb5a9] disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
"use client";
import { useState } from "react";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { ClientLayout } from "@/components/client-layout";

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const companies: any = [
    {
      id: 1,
      name: "National Bank",
      category: "Banking",
      status: "Open",
      rating: 4.5,
      location: "City Center Branch",
      phone: "+260 123 456",
      hours: "Mon–Fri: 8am–4pm",
    },
    {
      id: 2,
      name: "HealthCare Clinic",
      category: "Healthcare",
      status: "Closed",
      rating: 4.2,
      location: "Main Street",
      phone: "+260 987 654",
      hours: "Mon–Sat: 9am–6pm",
    },
  ];

  const categories = [
    "All",
    "Banking",
    "Healthcare",
    "Retail",
    "Telecommunications",
    "Government",
  ];

  const filteredCompanies = companies.filter(
    (company: { name: string; location: string; category: string }) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || company.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  const getStatusColor = (status: string) =>
    status === "Open"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e] transition-colors duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              placeholder-gray-500 dark:placeholder-gray-300
              focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[#beb5a9] 
              bg-white dark:bg-[#6e473b]/30 
              text-[#291c0e] dark:text-[#e1d4c2] 
              focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company: any) => (
            <div
              key={company.id}
              className="rounded-xl shadow-lg border border-[#beb5a9] 
              bg-white dark:bg-[#6e473b]/40 
              hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-1">
                      {company.name}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#6e473b] text-white">
                      {company.category}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-lg font-bold ${getStatusColor(company.status)}`}>
                      {company.status}
                    </span>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="ml-1 text-sm text-[#6e473b] dark:text-[#e1d4c2]">
                        {company.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="px-6 pb-4 space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-[#6e473b] dark:text-[#e1d4c2] mr-2" />
                  <span className="text-sm text-[#6e473b] dark:text-[#e1d4c2]">
                    {company.location}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-[#6e473b] dark:text-[#e1d4c2] mr-2" />
                  <span className="text-sm text-[#6e473b] dark:text-[#e1d4c2]">
                    {company.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-[#6e473b] dark:text-[#e1d4c2] mr-2" />
                  <span className="text-sm text-[#6e473b] dark:text-[#e1d4c2]">
                    {company.hours}
                  </span>
                </div>
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
    </ClientLayout>
  );
};

export default CompaniesPage;

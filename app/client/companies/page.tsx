"use client";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { MapPin, Phone, Clock, Users, Star, Bell, Zap } from "lucide-react";
import { ClientLayout } from "@/components/client-layout";

const CompaniesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const companies: any= [
    // ... your companies data
  ];

  const categories = ["All", "Banking", "Healthcare", "Retail", "Telecommunications", "Government"];

  const filteredCompanies = companies.filter( (company: { name: string; location: string; category: string; }) => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || company.category === selectedCategory;
    return matchesSearch && matchesCategory;
});

  const getStatusColor = (status: any) => (status === 'Open' ? 'text-green-600' : 'text-red-600');
  const getQueueColor = (length: any) => {
    if (length === 0) return 'text-gray-500';
    if (length < 10) return 'text-green-600';
    if (length < 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search companies or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-[#beb5a9] bg-white text-[#291c0e] placeholder-gray-500 focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-[#beb5a9] bg-white text-[#291c0e] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; rating: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; hours: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <div key={company.id} className="bg-white rounded-xl shadow-lg border border-[#beb5a9] overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#291c0e] mb-1">{company.name}</h3>
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
                      <span className="ml-1 text-sm text-[#6e473b]">{company.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location and Contact */}
              <div className="px-6 pb-4 space-y-2">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-[#6e473b] mr-2" />
                  <span className="text-sm text-[#6e473b]">{company.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-[#6e473b] mr-2" />
                  <span className="text-sm text-[#6e473b]">{company.phone}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-[#6e473b] mr-2" />
                  <span className="text-sm text-[#6e473b]">{company.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-[#291c0e] mb-2">No companies found</h3>
            <p className="text-[#6e473b]">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default CompaniesPage;

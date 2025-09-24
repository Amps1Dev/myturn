"use client";
import React, { useState } from 'react';
import { Send, Star, MessageSquare, Building2, Clock, MapPin } from 'lucide-react';
import { ClientLayout } from "@/components/client-layout";

const SuggestionBox = () => {
  const [rating, setRating] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Mock company data - in real app this would come from props/API
  const company = {
    name: "Downtown Medical Center",
    branch: "Main Branch",
    location: "123 Central Ave, City Center",
    lastVisit: "2024-01-15"
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (rating > 0 && suggestion.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setSuggestion('');
        setVisitDate('');
        setServiceType('');
      }, 2000);
    }
  };
  type StarRatingProps = {
  rating: number;
  onRatingChange: (rating: number) => void;
};

const StarRating = ({ rating, onRatingChange }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`transition-all duration-200 hover:scale-110 ${
            star <= rating 
              ? 'text-[#6e473b] dark:text-[#a78d78]' 
              : 'text-[#beb5a9] dark:text-[#6e473b] hover:text-[#a78d78] dark:hover:text-[#beb5a9]'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};


  return (
    <ClientLayout>
      <div className="min-h-screen bg-[#e1d4c2] dark:bg-[#291c0e] transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-[#6e473b] dark:text-[#a78d78]" />
              <h1 className="text-3xl font-bold text-[#291c0e] dark:text-[#e1d4c2] font-['Roboto']">
                Share Your Experience
              </h1>
            </div>
            <p className="text-[#6e473b] dark:text-[#beb5a9] text-lg font-['Roboto']">
              Help us improve by sharing your feedback and suggestions
            </p>
          </div>

          {/* Company Info Card */}
          <div className="bg-white dark:bg-[#6e473b] rounded-2xl shadow-lg p-6 mb-8 border border-[#beb5a9] dark:border-[#a78d78]">
            <div className="flex items-start gap-4">
              <div className="bg-[#a78d78] dark:bg-[#291c0e] p-3 rounded-xl">
                <Building2 className="w-6 h-6 text-white dark:text-[#e1d4c2]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-2 font-['Roboto']">
                  {company.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#6e473b] dark:text-[#beb5a9]">
                    <Building2 className="w-4 h-4" />
                    <span>{company.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6e473b] dark:text-[#beb5a9]">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6e473b] dark:text-[#beb5a9]">
                    <Clock className="w-4 h-4" />
                    <span>Last visit: {company.lastVisit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestion Form */}
          <div className="bg-white dark:bg-[#6e473b] rounded-2xl shadow-lg border border-[#beb5a9] dark:border-[#a78d78] overflow-hidden">
            {submitted ? (
              <div className="p-8 text-center">
                <div className="bg-[#a78d78] dark:bg-[#291c0e] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-white dark:text-[#e1d4c2]" />
                </div>
                <h3 className="text-2xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-2 font-['Roboto']">
                  Thank You!
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            ) : (
              <div className="p-8">
                {/* Rating Section */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-4 font-['Roboto']">
                    How would you rate your experience?
                  </label>
                  <div className="flex items-center gap-4">
                    <StarRating rating={rating} onRatingChange={setRating} />
                    {rating > 0 && (
                      <span className="text-[#6e473b] dark:text-[#beb5a9] font-medium font-['Roboto']">
                        {rating === 1 ? 'Poor' : 
                         rating === 2 ? 'Fair' : 
                         rating === 3 ? 'Good' : 
                         rating === 4 ? 'Very Good' : 'Excellent'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Service Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2 font-['Roboto']">
                    Service Type (Optional)
                  </label>
                  <input
                    type="text"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="e.g., Consultation, Emergency Care, etc."
                    className="w-full p-4 rounded-xl border border-[#beb5a9] dark:border-[#a78d78] bg-[#e1d4c2] dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] placeholder-[#6e473b] dark:placeholder-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-all duration-200 font-['Roboto']"
                  />
                </div>

                {/* Visit Date */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2 font-['Roboto']">
                    Visit Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full p-4 rounded-xl border border-[#beb5a9] dark:border-[#a78d78] bg-[#e1d4c2] dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-all duration-200 font-['Roboto']"
                  />
                </div>

                {/* Suggestion Text */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[#291c0e] dark:text-[#e1d4c2] mb-2 font-['Roboto']">
                    Your Feedback & Suggestions
                  </label>
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    rows={6}
                    placeholder="Share your experience and suggestions for improvement..."
                    className="w-full p-4 rounded-xl border border-[#beb5a9] dark:border-[#a78d78] bg-[#e1d4c2] dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] placeholder-[#6e473b] dark:placeholder-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:border-transparent transition-all duration-200 resize-none font-['Roboto']"
                    required
                  />
                  <p className="text-xs text-[#6e473b] dark:text-[#beb5a9] mt-2 font-['Roboto']">
                    {suggestion.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={rating === 0 || !suggestion.trim()}
                  className="w-full bg-[#6e473b] dark:bg-[#a78d78] text-white dark:text-[#291c0e] py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#a78d78] dark:hover:bg-[#beb5a9] focus:ring-2 focus:ring-[#a78d78] focus:ring-offset-2 focus:ring-offset-[#e1d4c2] dark:focus:ring-offset-[#291c0e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-['Roboto']"
                >
                  <Send className="w-5 h-5" />
                  Submit Feedback
                </button>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-[#beb5a9] dark:bg-[#6e473b] rounded-2xl p-6 border border-[#a78d78] dark:border-[#beb5a9]">
            <h4 className="text-lg font-semibold text-[#291c0e] dark:text-[#e1d4c2] mb-3 font-['Roboto']">
              💡 Tips for Better Feedback
            </h4>
            <ul className="space-y-2 text-sm text-[#291c0e] dark:text-[#beb5a9] font-['Roboto']">
              <li>• Be specific about what went well or what could be improved</li>
              <li>• Mention staff members who provided exceptional service</li>
              <li>• Include suggestions for wait time improvements</li>
              <li>• Comment on facility cleanliness and comfort</li>
            </ul>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default SuggestionBox;
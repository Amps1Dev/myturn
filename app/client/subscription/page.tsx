"use client";
import React, { useState } from 'react';
import { 
  Crown, 
  Star, 
  Zap, 
  Clock, 
  MapPin, 
  Bell, 
  Shield, 
  Calendar,
  Check,
  X,
  Sparkles,
  Gift,
  Users,
  TrendingUp,
  Heart,
  Phone
} from 'lucide-react';
import { ClientLayout } from "@/components/client-layout";

interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  premium?: boolean;
  features: PlanFeature[];
  color: string;
  gradient: string;
}

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic Queue',
      price: billingCycle === 'monthly' ? 0 : 0,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Perfect for occasional queue users',
      icon: <Users className="w-6 h-6" />,
      color: '#6e473b',
      gradient: 'from-[#6e473b] to-[#a78d78]',
      features: [
        { name: 'Join up to 5 queues per month', included: true },
        { name: 'Basic queue notifications', included: true },
        { name: 'Standard wait time estimates', included: true },
        { name: 'Mobile app access', included: true },
        { name: 'Priority queue placement', included: false },
        { name: 'Advanced notifications', included: false },
        { name: 'Skip-the-line privileges', included: false },
        { name: 'Premium support', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Priority Pass',
      price: billingCycle === 'monthly' ? 20 : 150,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Skip lines and get priority service',
      icon: <Crown className="w-6 h-6" />,
      popular: true,
      color: '#a78d78',
      gradient: 'from-[#a78d78] to-[#beb5a9]',
      features: [
        { name: 'Unlimited queue joins', included: true },
        { name: 'Priority queue placement', included: true, highlight: true },
        { name: 'Advanced AI wait predictions', included: true },
        { name: 'Real-time location tracking', included: true },
        { name: 'Smart notifications', included: true },
        { name: 'Skip up to 5 people per queue', included: true, highlight: true },
        { name: 'Emergency queue bypass', included: true },
        { name: '24/7 premium support', included: true }
      ]
    },
    {
      id: 'vip',
      name: 'VIP Elite',
      price: billingCycle === 'monthly' ? 40 : 240,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      description: 'Ultimate queue experience with exclusive perks',
      icon: <Sparkles className="w-6 h-6" />,
      premium: true,
      color: '#291c0e',
      gradient: 'from-[#291c0e] via-[#6e473b] to-[#a78d78]',
      features: [
        { name: 'Everything in Priority Pass', included: true },
        { name: 'Always first in line', included: true, highlight: true },
        { name: 'Concierge booking service', included: true },
        { name: 'VIP-only queue access', included: true, highlight: true },
        { name: 'Personal queue assistant', included: true },
        { name: 'Exclusive partner discounts', included: true },
        { name: 'White-glove customer service', included: true },
        { name: 'Family sharing (up to 4 members)', included: true, highlight: true }
      ]
    }
  ];

  const handleSubscribe = (planId: string): void => {
    setSelectedPlan(planId);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const PlanCard: React.FC<{ plan: SubscriptionPlan }> = ({ plan }) => (
    <div className={`relative rounded-3xl shadow-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
      plan.popular 
        ? 'border-[#a78d78] dark:border-[#beb5a9] bg-gradient-to-br from-white to-[#e1d4c2] dark:from-[#6e473b] dark:to-[#291c0e]' 
        : plan.premium
        ? 'border-[#291c0e] dark:border-[#a78d78] bg-gradient-to-br from-[#291c0e] to-[#6e473b] text-white'
        : 'border-[#beb5a9] dark:border-[#6e473b] bg-white dark:bg-[#6e473b]'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-[#a78d78] to-[#6e473b] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg font-['Roboto']">
            <Star className="w-4 h-4 inline mr-1" />
            Most Popular
          </div>
        </div>
      )}
      
      {plan.premium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-[#291c0e] to-[#6e473b] text-[#e1d4c2] px-6 py-2 rounded-full text-sm font-bold shadow-lg font-['Roboto']">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Premium Elite
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br ${plan.gradient}`}>
            <div className="text-white">
              {plan.icon}
            </div>
          </div>
          <h3 className={`text-2xl font-bold mb-2 font-['Roboto'] ${
            plan.premium ? 'text-[#e1d4c2]' : 'text-[#291c0e] dark:text-[#e1d4c2]'
          }`}>
            {plan.name}
          </h3>
          <p className={`text-sm ${
            plan.premium ? 'text-[#beb5a9]' : 'text-[#6e473b] dark:text-[#beb5a9]'
          } font-['Roboto']`}>
            {plan.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            <span className={`text-sm font-medium ${
              plan.premium ? 'text-[#beb5a9]' : 'text-[#6e473b] dark:text-[#beb5a9]'
            } font-['Roboto']`}>
              K
            </span>
            <span className={`text-5xl font-bold ${
              plan.premium ? 'text-[#e1d4c2]' : 'text-[#291c0e] dark:text-[#e1d4c2]'
            } font-['Roboto']`}>
              {plan.price}
            </span>
            <span className={`text-sm font-medium ml-1 ${
              plan.premium ? 'text-[#beb5a9]' : 'text-[#6e473b] dark:text-[#beb5a9]'
            } font-['Roboto']`}>
              {plan.period}
            </span>
          </div>
          {billingCycle === 'yearly' && (
            <div className="mt-2">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs font-bold font-['Roboto']">
                Save 10 months!
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                feature.included 
                  ? feature.highlight 
                    ? 'bg-gradient-to-r from-[#a78d78] to-[#6e473b]' 
                    : 'bg-[#a78d78] dark:bg-[#beb5a9]'
                  : 'bg-[#beb5a9] dark:bg-[#6e473b]'
              }`}>
                {feature.included ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <X className="w-3 h-3 text-[#6e473b] dark:text-[#beb5a9]" />
                )}
              </div>
              <span className={`text-sm font-['Roboto'] ${
                feature.included 
                  ? feature.highlight
                    ? `font-semibold ${plan.premium ? 'text-[#e1d4c2]' : 'text-[#291c0e] dark:text-[#e1d4c2]'}`
                    : plan.premium ? 'text-[#beb5a9]' : 'text-[#291c0e] dark:text-[#e1d4c2]'
                  : plan.premium ? 'text-[#6e473b] line-through' : 'text-[#6e473b] dark:text-[#beb5a9] line-through'
              }`}>
                {feature.name}
              </span>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <button
          onClick={() => handleSubscribe(plan.id)}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 font-['Roboto'] ${
            plan.premium
              ? 'bg-gradient-to-r from-[#e1d4c2] to-[#beb5a9] text-[#291c0e] hover:from-[#beb5a9] hover:to-[#a78d78] hover:text-white'
              : plan.popular
              ? 'bg-gradient-to-r from-[#a78d78] to-[#6e473b] text-white hover:from-[#6e473b] hover:to-[#291c0e]'
              : 'bg-[#6e473b] text-white hover:bg-[#a78d78] dark:bg-[#a78d78] dark:hover:bg-[#beb5a9] dark:text-[#291c0e]'
          } hover:scale-105 hover:shadow-lg`}
        >
          {selectedPlan === plan.id && showSuccess ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Subscribed!
            </div>
          ) : (
            `Choose ${plan.name}`
          )}
        </button>
      </div>
    </div>
  );

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#e1d4c2] via-[#beb5a9] to-[#e1d4c2] dark:from-[#291c0e] dark:via-[#6e473b] dark:to-[#291c0e] transition-all duration-300">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-[#a78d78] to-[#6e473b] p-3 rounded-2xl">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#291c0e] to-[#6e473b] dark:from-[#e1d4c2] dark:to-[#beb5a9] bg-clip-text text-transparent font-['Roboto']">
                MyTurn Premium
              </h1>
            </div>
            <p className="text-xl text-[#6e473b] dark:text-[#beb5a9] mb-8 font-['Roboto'] max-w-3xl mx-auto">
              Skip the wait, save your time. Choose the perfect plan to revolutionize how you experience queues in Zambia.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white dark:bg-[#6e473b] p-2 rounded-2xl inline-flex shadow-lg border border-[#beb5a9] dark:border-[#a78d78]">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 font-['Roboto'] ${
                  billingCycle === 'monthly'
                    ? 'bg-[#a78d78] text-white shadow-md'
                    : 'text-[#6e473b] dark:text-[#beb5a9] hover:bg-[#e1d4c2] dark:hover:bg-[#291c0e]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 font-['Roboto'] relative ${
                  billingCycle === 'yearly'
                    ? 'bg-[#a78d78] text-white shadow-md'
                    : 'text-[#6e473b] dark:text-[#beb5a9] hover:bg-[#e1d4c2] dark:hover:bg-[#291c0e]'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Features Comparison */}
          <div className="bg-white dark:bg-[#6e473b] rounded-3xl shadow-2xl p-8 border border-[#beb5a9] dark:border-[#a78d78] mb-12">
            <h2 className="text-3xl font-bold text-center text-[#291c0e] dark:text-[#e1d4c2] mb-8 font-['Roboto']">
              Why Choose MyTurn Premium?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#a78d78] to-[#6e473b] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-3 font-['Roboto']">
                  Save Time Daily
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                  Skip long queues at banks, hospitals, and government offices. Your time is precious.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#a78d78] to-[#6e473b] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-3 font-['Roboto']">
                  Smart Predictions
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                  AI-powered wait time predictions help you plan your day perfectly.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-[#a78d78] to-[#6e473b] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-3 font-['Roboto']">
                  Priority Care
                </h3>
                <p className="text-[#6e473b] dark:text-[#beb5a9] font-['Roboto']">
                  Special consideration for medical needs, pregnancy, and senior citizens.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-r from-[#beb5a9] to-[#e1d4c2] dark:from-[#6e473b] dark:to-[#291c0e] rounded-3xl p-8 text-center">
            <h2 className="text-2xl font-bold text-[#291c0e] dark:text-[#e1d4c2] mb-4 font-['Roboto']">
              Questions? We're Here to Help!
            </h2>
            <p className="text-[#6e473b] dark:text-[#beb5a9] mb-6 font-['Roboto']">
              Contact our support team for any questions about our premium plans.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+260-xxx-xxx-xxx" 
                className="bg-[#6e473b] dark:bg-[#a78d78] text-white dark:text-[#291c0e] px-6 py-3 rounded-xl hover:bg-[#a78d78] dark:hover:bg-[#beb5a9] transition-all duration-200 font-['Roboto'] flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </a>
              <button className="bg-white dark:bg-[#291c0e] text-[#291c0e] dark:text-[#e1d4c2] px-6 py-3 rounded-xl hover:bg-[#e1d4c2] dark:hover:bg-[#6e473b] transition-all duration-200 font-['Roboto'] border border-[#a78d78] dark:border-[#beb5a9]">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default SubscriptionPage;
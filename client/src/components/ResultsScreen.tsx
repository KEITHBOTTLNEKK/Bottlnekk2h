import { useState } from "react";
import { useCounter } from "@/hooks/useCounter";
import type { DiagnosticResult } from "@shared/schema";

interface ResultsScreenProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const animatedTotal = useCounter({ 
    end: result.totalLoss, 
    duration: 2500,
    start: 0
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookCall = () => {
    setShowBookingForm(true);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || undefined,
          diagnosticData: {
            totalLoss: result.totalLoss,
            provider: result.provider,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }
      
      setSubmitSuccess(true);
      
      // Reset form after success (give enough time for user to see the message)
      setTimeout(() => {
        setShowBookingForm(false);
        setSubmitSuccess(false);
        setFormData({ name: "", email: "", phone: "", company: "" });
      }, 3500);
    } catch (error) {
      console.error("Error submitting booking:", error);
      setFormErrors({ submit: "Failed to submit booking. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 
              className="text-4xl sm:text-5xl font-thin text-white tracking-tight"
              data-testid="heading-book-call"
            >
              Let's Reclaim Your Revenue
            </h2>
            <p className="text-lg font-extralight text-[#9CA3AF] tracking-wide">
              Book a call with our team to stop losing {formatCurrency(result.totalLoss)} every month
            </p>
          </div>

          {submitSuccess ? (
            <div 
              className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
              data-testid="success-message"
            >
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/60" />
              </div>
              <p className="text-2xl font-light text-white tracking-wide">
                Thank you! We'll be in touch soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-light text-[#9CA3AF] tracking-wide">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.name ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="John Smith"
                  data-testid="input-name"
                />
                {formErrors.name && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-name">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-light text-[#9CA3AF] tracking-wide">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.email ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="john@company.com"
                  data-testid="input-email"
                />
                {formErrors.email && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-email">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-light text-[#9CA3AF] tracking-wide">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/30 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.phone ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="(555) 123-4567"
                  data-testid="input-phone"
                />
                {formErrors.phone && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-phone">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-light text-[#9CA3AF] tracking-wide">
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleFormChange("company", e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-white/30 font-light tracking-wide focus:outline-none focus:border-white transition-colors duration-300"
                  placeholder="ABC Plumbing"
                  data-testid="input-company"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-8 py-4 border-2 border-white/20 text-white rounded-lg font-light tracking-wide hover:border-white hover:bg-white/5 transition-all duration-300"
                  data-testid="button-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 group relative inline-flex items-center justify-center px-8 py-4 text-base font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit-booking"
                >
                  <span className="relative z-10 tracking-wide">
                    {isSubmitting ? "Submitting..." : "Book Your Call"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </form>
          )}

          <div className="text-center">
            <button
              onClick={onRestart}
              className="text-sm font-light text-[#6B7280] hover:text-white tracking-wide transition-colors duration-300"
              data-testid="button-restart"
            >
              ← Run another diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl w-full space-y-16">
        {/* Main Loss Number */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 
              className="text-7xl sm:text-8xl lg:text-9xl font-thin text-white tracking-tighter leading-none"
              data-testid="text-total-loss"
            >
              {formatCurrency(animatedTotal)}
            </h1>
            <p 
              className="text-xl sm:text-2xl font-extralight text-[#9CA3AF] tracking-wide"
              data-testid="text-loss-description"
            >
              lost this month from {formatNumber(result.totalMissedOpportunities)} missed opportunities.
            </p>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-3" data-testid="metric-missed-calls">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Missed Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.missedCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-after-hours">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              After-Hours Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.afterHoursCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-abandoned">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Abandoned Calls
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatNumber(result.abandonedCalls)}
            </div>
          </div>

          <div className="space-y-3" data-testid="metric-avg-revenue">
            <div className="text-sm font-light text-[#6B7280] tracking-widest uppercase">
              Avg Revenue Per Call
            </div>
            <div className="text-5xl font-thin text-white tracking-tight">
              {formatCurrency(result.avgRevenuePerCall)}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={handleBookCall}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            data-testid="button-reclaim"
          >
            <span className="relative z-10 tracking-wide">Reclaim Your Revenue</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Source Attribution */}
        <div className="text-center pt-8">
          <p className="text-xs font-light text-[#6B7280] tracking-wide">
            Data analyzed from {result.provider} • {result.month}
          </p>
        </div>
      </div>
    </div>
  );
}

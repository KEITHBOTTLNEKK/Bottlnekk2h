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
      <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full space-y-12">
          <div className="text-center space-y-4">
            <h2 
              className="text-4xl sm:text-5xl font-thin text-white tracking-tight"
              data-testid="heading-book-call"
            >
              Let's fix this
            </h2>
            <p className="text-lg font-extralight text-[#9CA3AF] tracking-wide">
              Stop losing {formatCurrency(result.totalLoss)} every month
            </p>
          </div>

          {submitSuccess ? (
            <div 
              className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
              data-testid="success-message"
            >
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-white/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-2xl font-light text-white tracking-wide">
                We'll be in touch soon
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="space-y-2">
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.name ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="Your name"
                  data-testid="input-name"
                />
                {formErrors.name && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-name">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.email ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="Email address"
                  data-testid="input-email"
                />
                {formErrors.email && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-email">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className={`w-full px-6 py-4 bg-white/5 border-2 rounded-lg text-white placeholder-white/40 font-light tracking-wide focus:outline-none transition-colors duration-300 ${
                    formErrors.phone ? 'border-red-500' : 'border-white/20 focus:border-white'
                  }`}
                  placeholder="Phone number"
                  data-testid="input-phone"
                />
                {formErrors.phone && (
                  <p className="text-sm font-light text-red-400 tracking-wide" data-testid="error-phone">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleFormChange("company", e.target.value)}
                  className="w-full px-6 py-4 bg-white/5 border-2 border-white/20 rounded-lg text-white placeholder-white/40 font-light tracking-wide focus:outline-none focus:border-white transition-colors duration-300"
                  placeholder="Company name (optional)"
                  data-testid="input-company"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-lg font-light text-black bg-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-submit-booking"
              >
                <span className="relative z-10 tracking-wide">
                  {isSubmitting ? "Sending..." : "Book a Call"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          )}

          <div className="text-center pt-4">
            <button
              onClick={() => setShowBookingForm(false)}
              className="text-sm font-light text-[#6B7280] hover:text-white tracking-wide transition-colors duration-300"
              data-testid="button-cancel"
            >
              ← Back to results
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl w-full space-y-20">
        {/* The Number - Make it HURT */}
        <div className="text-center space-y-6">
          <h1 
            className="text-8xl sm:text-9xl lg:text-[12rem] font-thin text-white tracking-tighter leading-none"
            data-testid="text-total-loss"
          >
            {formatCurrency(animatedTotal)}
          </h1>
          <p 
            className="text-2xl sm:text-3xl font-thin text-white/60 tracking-wide max-w-2xl mx-auto"
            data-testid="text-loss-description"
          >
            You lost this last month.
          </p>
        </div>

        {/* Simple Insight - Conversational, not data */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <p className="text-lg sm:text-xl font-light text-white/80 tracking-wide" data-testid="metric-missed-calls">
            {formatNumber(result.missedCalls)} missed {result.missedCalls === 1 ? 'call' : 'calls'}.
            {result.afterHoursCalls > 0 && (
              <span className="text-white/50"> {formatNumber(result.afterHoursCalls)} {result.afterHoursCalls === 1 ? 'was' : 'were'} after hours.</span>
            )}
          </p>
          <p className="text-base font-extralight text-white/40 tracking-wide">
            At {formatCurrency(result.avgRevenuePerCall)} per customer
          </p>
        </div>

        {/* ONE Clear Action */}
        <div className="text-center space-y-6">
          <button
            onClick={handleBookCall}
            className="group relative inline-flex items-center justify-center px-16 py-6 text-xl font-light text-black bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
            data-testid="button-reclaim"
          >
            <span className="relative z-10 tracking-wide">Fix This</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <p className="text-sm font-light text-white/30 tracking-wide">
            Book a 15-minute call with our team
          </p>
        </div>

        {/* Minimal footer */}
        <div className="text-center space-y-4 pt-12">
          <p className="text-xs font-light text-white/20 tracking-wide">
            {result.provider} • {result.month}
          </p>
          <button
            onClick={onRestart}
            className="text-xs font-light text-white/20 hover:text-white/60 tracking-wide transition-colors duration-300"
            data-testid="button-restart"
          >
            Run another diagnostic
          </button>
        </div>
      </div>
    </div>
  );
}

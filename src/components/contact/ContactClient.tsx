"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles, ChevronDown } from "lucide-react";

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "Maison Balayage & French Gloss",
    message: "",
    vipSuite: false,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is your appointment cancellation and rescheduling policy?",
      a: "We kindly request at least 24 hours notice for any cancellation or rescheduling to ensure our master artisans can accommodate waitlisted clients. Changes made within 24 hours may incur a 50% reservation fee.",
    },
    {
      q: "Do you offer private VIP styling suites?",
      a: "Yes. Our atelier features four completely isolated VIP chambers with private direct elevator access, individual audio systems, and dedicated concierge attendants for high-profile patrons.",
    },
    {
      q: "Can I bring inspiration photographs to my appointment?",
      a: "Absolutely. During your initial 15-minute diagnostic consultation, your stylist will analyze your reference images in the context of your face shape, natural hair texture, and maintenance preferences.",
    },
    {
      q: "Is valet parking available on Madison Avenue?",
      a: "Yes, complimentary valet parking is provided directly in front of 740 Madison Avenue between 64th and 65th Street for all booked appointments.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate real inquiry API dispatch
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "ADMIN",
          title: "New Concierge Inquiry",
          message: `${formData.name} inquired regarding ${formData.serviceInterest} (VIP Suite: ${formData.vipSuite ? "Yes" : "No"})`,
        }),
      }).catch(() => {});

      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 700);
    } catch {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-[#161616] border border-white/5 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-[#C8A46A] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Concierge Desk</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] font-light uppercase mb-6">
              Atelier Coordinates
            </h2>

            <p className="text-sm text-[#929292] leading-relaxed mb-8">
              Our concierge team is available seven days a week to curate your personalized appointment, arrange private penthouse bookings, or answer any formulation questions.
            </p>

            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#C8A46A]/30 flex items-center justify-center shrink-0 text-[#C8A46A]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#F8F6F2]">Atelier Location</h4>
                  <p className="text-xs text-[#929292] mt-1 leading-relaxed">
                    740 Madison Avenue, Penthouse Level 4<br />
                    New York, NY 10065 (Valet Available)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#C8A46A]/30 flex items-center justify-center shrink-0 text-[#C8A46A]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#F8F6F2]">Direct Telephone</h4>
                  <a href="tel:+12128907733" className="text-xs text-[#E8DDCE] hover:text-[#C8A46A] transition-colors mt-1 block">
                    +1 (212) 890-7733
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#C8A46A]/30 flex items-center justify-center shrink-0 text-[#C8A46A]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#F8F6F2]">Email Inquiries</h4>
                  <a href="mailto:concierge@elixirhautebeaute.com" className="text-xs text-[#E8DDCE] hover:text-[#C8A46A] transition-colors mt-1 block">
                    concierge@elixirhautebeaute.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#C8A46A]/30 flex items-center justify-center shrink-0 text-[#C8A46A]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-[#F8F6F2]">Atelier Hours</h4>
                  <p className="text-xs text-[#929292] mt-1">
                    Monday – Sunday: 09:00 – 20:00<br />
                    VIP After-Hours by prior arrangement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8">
            <a
              href="https://wa.me/12128907733"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 bg-[#1B1B1B] text-[#C8A46A] border border-[#C8A46A]/40 text-center uppercase tracking-widest text-xs font-semibold hover:bg-[#C8A46A] hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7 bg-[#161616] border border-white/5 p-8 sm:p-10">
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#F8F6F2] uppercase font-light mb-2">
              Bespoke Inquiry
            </h3>
            <p className="text-xs text-[#929292]">
              Submit your request to our lead concierge. We respond within two business hours.
            </p>
          </div>

          {submitted ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#C8A46A] mx-auto mb-4" />
              <h4 className="font-serif text-2xl text-[#F8F6F2] mb-2">
                Inquiry Received
              </h4>
              <p className="text-xs text-[#929292] max-w-md mx-auto mb-6 leading-relaxed">
                Thank you, {formData.name}. Our senior concierge will review your preferred treatment and contact you shortly at {formData.email || formData.phone}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 border border-[#C8A46A]/40 text-xs text-[#C8A46A] uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Lady Genevieve Sterling"
                    className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@luxury.com"
                    className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (212) 000-0000"
                    className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                    Treatment of Interest
                  </label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full bg-[#111111] border border-white/10 text-xs text-[#E8DDCE] p-3.5 focus:outline-none focus:border-[#C8A46A] cursor-pointer"
                  >
                    <option value="Maison Balayage & French Gloss">Maison Balayage & French Gloss</option>
                    <option value="Haute Couture Precision Cut">Haute Couture Precision Cut</option>
                    <option value="Japanese Waterfall Head Spa">Japanese Waterfall Head Spa</option>
                    <option value="Tokyo Precision Thermal Rebonding">Tokyo Precision Thermal Rebonding</option>
                    <option value="Royal Matrimonial Bridal Styling">Royal Matrimonial Bridal Styling</option>
                    <option value="24K Aurum Cellular Lifting Facial">24K Aurum Cellular Lifting Facial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#929292] block mb-2">
                  Special Notes or Desired Consultation Date
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your hair history, upcoming event, or special accommodations..."
                  className="w-full bg-[#111111] border border-white/10 text-xs text-[#F8F6F2] p-3.5 focus:outline-none focus:border-[#C8A46A]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="vipSuite"
                  checked={formData.vipSuite}
                  onChange={(e) => setFormData({ ...formData, vipSuite: e.target.checked })}
                  className="w-4 h-4 accent-[#C8A46A] bg-[#111111] border border-white/20 rounded cursor-pointer"
                />
                <label htmlFor="vipSuite" className="text-xs text-[#E8DDCE] cursor-pointer select-none">
                  Request Private VIP Penthouse Chamber (Subject to availability)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#C8A46A] text-[#111111] font-semibold text-xs uppercase tracking-[0.25em] hover:bg-[#D8B57B] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#C8A46A]/20"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? "Transmitting Request..." : "Send Concierge Inquiry"}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs text-[#C8A46A] tracking-[0.3em] uppercase block mb-2">
            Guidance
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#F8F6F2] font-light uppercase">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#161616] border border-white/5 overflow-hidden transition-colors hover:border-[#C8A46A]/30"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="font-serif text-base text-[#F8F6F2]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C8A46A] shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-xs text-[#929292] leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

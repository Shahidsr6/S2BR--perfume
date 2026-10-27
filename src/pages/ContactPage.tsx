import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupabaseService } from '../services/supabase';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Gifting & Corporate Orders');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQs Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Cash on Delivery (COD) work across Pakistan?",
      a: "We partner with TCS, CallCourier, and Leopard Express nationwide. You do not pay anything in advance. When the delivery rider arrives at your doorstep, you may inspect the sealed package before paying cash or via Raast mobile transfer."
    },
    {
      q: "What is your 7-Day Exchange & Tester Protocol?",
      a: "Every full-size flacon arrives with an external 2ml complimentary sample vial. Test this 2ml sample first on your skin. If you feel the scent profile doesn't suit your personal taste, contact our WhatsApp within 7 days to return the unopened master bottle for a 100% full refund or exchange."
    },
    {
      q: "What is the expected delivery timeframe?",
      a: "Orders placed before 4:00 PM are dispatched on the same business day. Deliveries within Lahore, Karachi, and Islamabad / Rawalpindi arrive within 24 to 48 hours. Other cities and districts arrive within 2 to 4 business days."
    },
    {
      q: "Why are S2BR fragrances more long-lasting than commercial imports?",
      a: "S2BR compounds at an extraordinary 32% to 38% pure perfume oil concentration (Extrait de Parfum grade), compared to standard 12-15% commercial Eau de Parfum. We also anchor our formulas with natural aged amber, cambodian oud, and labdanum fixatives."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in required fields.', 'error');
      return;
    }
    setSubmitted(true);
    SupabaseService.syncContactMessage({
      name,
      email,
      phone,
      subject,
      message
    }).catch(err => console.warn('Supabase contact message sync notice:', err));

    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    showToast('Your message has reached our VIP Concierge team. We will respond within 2 hours.');
  };

  return (
    <div className="w-full bg-[#141312] text-[#e6e1df] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-[0.3em] uppercase block">
            VIP Patron Services
          </span>
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#e6e1df] font-serif">
            Contact S2BR Concierge
          </h1>
          <p className="font-body-md text-[14px] text-[#d0c5af]">
            For private olfactory consultations, corporate gift curation, or order inquiries.
          </p>
        </div>

        {/* Contact Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#1d1b1a] p-6 sm:p-8 border border-[#4d4635]/30 shadow-2xl">
            <h3 className="font-headline-sm text-xl text-[#e6e1df] font-serif mb-4">
              Send Concierge Inquiry
            </h3>

            {submitted ? (
              <div className="p-6 bg-[#211f1e] border border-[#f2ca50]/40 text-center space-y-3">
                <span className="material-symbols-outlined text-[#f2ca50] text-[36px]">task_alt</span>
                <h4 className="font-headline-sm text-lg text-[#e6e1df]">Inquiry Dispatched Successfully</h4>
                <p className="font-body-sm text-[13px] text-[#d0c5af]">
                  Our fragrance specialist in Lahore will review your inquiry and connect via WhatsApp / Email promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Fawad Malik"
                      className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">WhatsApp Contact</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="patron@domain.com"
                      className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50]"
                    >
                      <option value="Bespoke Gifting & Corporate Orders" className="bg-[#1d1b1a]">Bespoke Gifting & Corporate Orders</option>
                      <option value="Order Tracking & Logistics" className="bg-[#1d1b1a]">Order Tracking & Logistics</option>
                      <option value="Olfactory Recommendation" className="bg-[#1d1b1a]">Olfactory Recommendation</option>
                      <option value="Exchange Protocol" className="bg-[#1d1b1a]">Exchange Protocol</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-label-caps text-[10px] text-[#d0c5af] uppercase">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your inquiry or requirements..."
                    className="w-full px-3 py-2 bg-[#211f1e] text-[#e6e1df] text-[13px] border border-[#4d4635]/40 focus:outline-none focus:border-[#f2ca50] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-title-sc text-[12px] uppercase font-bold tracking-wider transition-colors shadow-lg"
                >
                  DISPATCH INQUIRY TO CONCIERGE
                </button>
              </form>
            )}
          </div>

          {/* Boutiques & Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout */}
            <div className="bg-[#211f1e] p-6 border border-[#f2ca50]/30 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-[#f2ca50]">
                <span className="material-symbols-outlined text-[24px]">chat</span>
                <span className="font-title-sc text-[12px] uppercase font-bold">Instant WhatsApp Hotline</span>
              </div>
              <p className="font-body-sm text-[13px] text-[#d0c5af]">
                Connect immediately with an S2BR Fragrance Specialist for instant recommendations or order status verification.
              </p>
              <a
                href="https://wa.me/923000077227"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f2ca50] text-[#3c2f00] font-title-sc text-[11px] uppercase font-bold tracking-wider hover:bg-[#ffe088]"
              >
                <span>OPEN WHATSAPP (+92 300 007-S2BR)</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>

            {/* Flagship Locations */}
            <div className="bg-[#1d1b1a] p-6 border border-[#4d4635]/30 shadow-xl space-y-4">
              <span className="font-title-sc text-[12px] text-[#f2ca50] uppercase tracking-wider block font-bold">
                Flagship Boutiques
              </span>

              <div className="space-y-1 text-[13px] font-body-sm border-b border-[#4d4635]/25 pb-3">
                <h4 className="text-[#e6e1df] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">store</span>
                  Lahore Atelier & Logistics Hub
                </h4>
                <p className="text-[#99907c]">Plot 14-C, Sector Y, Commercial Area, DHA Phase 6, Lahore</p>
                <p className="text-[#d0c5af]">Hours: 11:00 AM – 10:00 PM (Monday – Sunday)</p>
              </div>

              <div className="space-y-1 text-[13px] font-body-sm">
                <h4 className="text-[#e6e1df] font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#f2ca50] text-[16px]">store</span>
                  Karachi Atelier Boutique
                </h4>
                <p className="text-[#99907c]">Street 8, Block 4, Clifton, Karachi</p>
                <p className="text-[#d0c5af]">Hours: 12:00 PM – 11:00 PM (Monday – Sunday)</p>
              </div>
            </div>

          </div>

        </div>

        {/* FAQs Accordion Section */}
        <div className="pt-8 border-t border-[#4d4635]/30">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-label-caps text-[11px] text-[#f2ca50] tracking-widest uppercase">
              Immediate Guidance
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#e6e1df] font-serif mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#1d1b1a] border border-[#4d4635]/30 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-headline-sm text-[15px] text-[#e6e1df] hover:text-[#f2ca50] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 font-body-md text-[13px] text-[#d0c5af] leading-relaxed border-t border-[#4d4635]/20">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

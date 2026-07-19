import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate form submission (frontend only)
      console.log('Form submitted:', formData);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300" style={{ fontFamily: "'Outfit', sans-serif" }}>Get In Touch</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="contact-title"
          >
            We'd Love to{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Have questions about GapFinder? Want to share feedback? We're here to help you on your journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="contact-info-email">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl w-fit mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Email Us
              </h3>
              <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                We typically respond within 24 hours
              </p>
              <a href="mailto:support@gapfinder.com" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                support@gapfinder.com
              </a>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="contact-info-location">
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-3 rounded-xl w-fit mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Location
              </h3>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                San Francisco, CA<br />
                United States
              </p>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="contact-info-phone">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl w-fit mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Call Us
              </h3>
              <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Monday - Friday, 9am - 6pm PST
              </p>
              <a href="tel:+1234567890" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12" data-testid="contact-success-message">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full p-4 w-fit mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    Message Sent Successfully!
                  </h3>
                  <p className="text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        data-testid="contact-input-name"
                        className={`w-full bg-white/5 border ${
                          errors.name ? 'border-red-500/50' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                        placeholder="John Doe"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        data-testid="contact-input-email"
                        className={`w-full bg-white/5 border ${
                          errors.email ? 'border-red-500/50' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                        placeholder="john@example.com"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      data-testid="contact-input-subject"
                      className={`w-full bg-white/5 border ${
                        errors.subject ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                      placeholder="How can we help you?"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      data-testid="contact-input-message"
                      className={`w-full bg-white/5 border ${
                        errors.message ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none`}
                      placeholder="Tell us more about your inquiry..."
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    ></textarea>
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    data-testid="contact-submit-button"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-4 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center space-x-2"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                  >
                    <span>Send Message</span>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
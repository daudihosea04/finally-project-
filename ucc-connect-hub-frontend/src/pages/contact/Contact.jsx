import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const { colors } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>Contact <span style={{ color: colors.primary }}>Us</span></h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>Get in touch with UCC Dodoma</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <Mail size={24} style={{ color: colors.primary }} /><div><div className="font-semibold">Email</div><span>info@uccconnect.ac.tz</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <Phone size={24} style={{ color: colors.primary }} /><div><div className="font-semibold">Phone</div><span>+255 747 172 018</span></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                <MapPin size={24} style={{ color: colors.primary }} /><div><div className="font-semibold">Location</div><span>UCC Dodoma Campus, Tanzania</span></div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>Send Message</h2>
            {submitted ? (
              <div className="text-center p-8"><div className="text-5xl mb-3">✅</div><h3 className="text-xl font-bold">Message Sent!</h3><p>We'll get back to you soon.</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required></textarea>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Send size={18} /> Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
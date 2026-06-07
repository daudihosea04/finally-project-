import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { Send, CheckCircle, Mail } from 'lucide-react';

const Newsletter = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-card p-12 text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`, border: `1px solid ${colors.border}` }}>
          <Mail size={48} style={{ color: colors.primary }} className="mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: colors.textPrimary }}>Stay Updated</h2>
          <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>Subscribe to our newsletter for the latest updates, events, and resources</p>
          
          {subscribed ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg mx-auto max-w-md" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
              <CheckCircle size={20} /> Thanks for subscribing! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field flex-1" style={{ border: `1px solid ${colors.border}` }} required />
              <button type="submit" className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: '#000' }}>
                <Send size={18} /> Subscribe
              </button>
            </form>
          )}
          <p className="text-xs mt-4" style={{ color: colors.textSubtle }}>No spam, unsubscribe anytime. We respect your privacy.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

const UpcomingEvents = () => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const events = [
    { title: 'Tech Innovation Summit 2026', date: 'June 25, 2026', time: '10:00 AM', location: 'Main Auditorium', attendees: 200, image: '🚀' },
    { title: 'Career Fair & Networking', date: 'July 5, 2026', time: '9:00 AM', location: 'Conference Hall', attendees: 150, image: '💼' },
    { title: 'Research Symposium', date: 'July 15, 2026', time: '11:00 AM', location: 'Online - Zoom', attendees: 300, image: '📚' },
    { title: 'Alumni Meetup 2026', date: 'July 20, 2026', time: '3:00 PM', location: 'Alumni Center', attendees: 100, image: '🎓' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: colors.textPrimary }}>Upcoming <span style={{ color: colors.primary }}>Events</span></h2>
            <p className="text-lg" style={{ color: colors.textSecondary }}>Don't miss out on these exciting opportunities</p>
          </motion.div>
          <motion.button initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onClick={() => navigate('/events')} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ color: colors.primary, border: `1px solid ${colors.primary}` }}>View All Events <ArrowRight size={16} /></motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="glass-card p-5 group hover:scale-105 transition-all" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.backgroundCard }}>
              <div className="text-5xl mb-3">{event.image}</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>{event.title}</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}><Calendar size={14} /> {event.date}</div>
                <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}><Clock size={14} /> {event.time}</div>
                <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}><MapPin size={14} /> {event.location}</div>
                <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}><Users size={14} /> {event.attendees} attending</div>
              </div>
              <button onClick={() => navigate('/register')} className="w-full py-2 rounded-lg font-semibold transition-all" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>Register Now</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
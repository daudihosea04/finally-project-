import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Events = () => {
  const { colors } = useTheme();

  const events = [
    { id: 1, title: 'March/April Intake Registration', date: 'March 1 - April 15, 2026', location: 'UCC Dodoma Campus', type: 'Registration', image: '📝' },
    { id: 2, title: 'New Student Orientation', date: 'April 20, 2026', location: 'Main Hall', type: 'Orientation', image: '🎓' },
    { id: 3, title: 'Mid-Semester Examinations', date: 'June 10 - June 20, 2026', location: 'Various Venues', type: 'Examination', image: '📚' },
    { id: 4, title: 'Career Fair & Networking', date: 'July 5, 2026', location: 'Conference Hall', type: 'Career', image: '💼' },
    { id: 5, title: 'September/October Intake', date: 'September 1 - October 15, 2026', location: 'UCC Dodoma Campus', type: 'Registration', image: '📝' },
    { id: 6, title: 'Final Examinations', date: 'August 5 - August 20, 2026', location: 'Various Venues', type: 'Examination', image: '📝' },
    { id: 7, title: 'Graduation Ceremony', date: 'October 30, 2026', location: 'UCC Dodoma Campus', type: 'Graduation', image: '🎉' },
  ];

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>Academic <span style={{ color: colors.primary }}>Calendar</span></h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>Key dates for the 2025/2026 Academic Year</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6 text-center rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
            <Calendar size={40} style={{ color: colors.primary }} className="mx-auto mb-3" />
            <h3 className="font-bold">Two Intakes Per Year</h3>
            <p className="text-sm">March/April • September/October</p>
          </div>
          <div className="glass-card p-6 text-center rounded-2xl" style={{ border: `1px solid ${colors.border}` }}>
            <Clock size={40} style={{ color: colors.primary }} className="mx-auto mb-3" />
            <h3 className="font-bold">Two Semesters</h3>
            <p className="text-sm">Semester 1: April - August • Semester 2: October - February</p>
          </div>
        </div>

        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="glass-card p-5 rounded-xl" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex gap-4">
                <div className="text-4xl">{event.image}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>{event.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>{event.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm mb-2">
                    <div className="flex items-center gap-1"><Calendar size={14} style={{ color: colors.primary }} />{event.date}</div>
                    <div className="flex items-center gap-1"><MapPin size={14} style={{ color: colors.primary }} />{event.location}</div>
                  </div>
                  <button className="mt-2 px-4 py-1 rounded-lg text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Add to Calendar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
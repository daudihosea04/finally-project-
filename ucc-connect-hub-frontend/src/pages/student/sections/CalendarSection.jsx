import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, BookOpen } from 'lucide-react';

const CalendarSection = () => {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const events = [
    { id: 1, title: 'Midterm Exam', date: 25, month: 2, type: 'exam', course: 'Web Development', time: '2:00 PM', room: 'Hall A' },
    { id: 2, title: 'Assignment Due', date: 28, month: 2, type: 'deadline', course: 'Database Systems', time: '11:59 PM' },
    { id: 3, title: 'Guest Lecture', date: 30, month: 2, type: 'event', course: 'AI Seminar', time: '10:00 AM', room: 'Auditorium' },
  ];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const getEventForDay = (day) => events.filter(e => e.date === day && e.month === currentDate.getMonth());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Academic Calendar</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>View important dates, exams, and deadlines</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.primary }}><ChevronLeft size={20} /></button>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-opacity-10 transition" style={{ color: colors.primary }}><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            <div className="py-2 text-sm font-medium text-red-500">Sun</div>
            <div className="py-2 text-sm font-medium">Mon</div>
            <div className="py-2 text-sm font-medium">Tue</div>
            <div className="py-2 text-sm font-medium">Wed</div>
            <div className="py-2 text-sm font-medium">Thu</div>
            <div className="py-2 text-sm font-medium">Fri</div>
            <div className="py-2 text-sm font-medium text-blue-500">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <div key={idx} className={`aspect-square p-2 rounded-lg ${day ? 'cursor-pointer hover:scale-105 transition-all' : ''}`} style={{ backgroundColor: day && getEventForDay(day).length > 0 ? `${colors.primary}15` : 'transparent', border: `1px solid ${colors.border}` }}>
                <div className="text-sm font-medium" style={{ color: day && getEventForDay(day).length > 0 ? colors.primary : colors.textPrimary }}>{day || ''}</div>
                {day && getEventForDay(day).map(event => (
                  <div key={event.id} className="text-xs mt-1 truncate" style={{ color: event.type === 'exam' ? '#FF4444' : event.type === 'deadline' ? '#FFD700' : '#32CD32' }}>{event.title}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event, idx) => (
              <div key={event.id} className="p-3 rounded-lg hover:scale-102 transition-all" style={{ backgroundColor: `${colors.primary}10` }}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${event.type === 'exam' ? 'bg-red-500/20' : event.type === 'deadline' ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                    <CalendarIcon size={16} style={{ color: event.type === 'exam' ? '#FF4444' : event.type === 'deadline' ? '#FFD700' : '#32CD32' }} />
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: colors.textPrimary }}>{event.title}</div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span style={{ color: colors.textSecondary }}>📅 {monthNames[event.month]} {event.date}, {currentDate.getFullYear()}</span>
                      <span style={{ color: colors.textSecondary }}>⏰ {event.time}</span>
                    </div>
                    {event.course && (
                      <div className="flex gap-2 mt-1 text-xs">
                        <span style={{ color: colors.primary }}>📚 {event.course}</span>
                        {event.room && <span style={{ color: colors.textSubtle }}>📍 {event.room}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSection;
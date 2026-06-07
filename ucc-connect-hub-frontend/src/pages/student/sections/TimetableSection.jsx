import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Clock, MapPin, User } from 'lucide-react';

const TimetableSection = () => {
  const { colors } = useTheme();
  
  const timetable = [
    { id: 1, day: 'Monday', time: '9:00 - 10:30', course: 'Web Development', room: 'Lab 301', instructor: 'Prof. Johnson', type: 'Lecture' },
    { id: 2, day: 'Monday', time: '11:00 - 12:30', course: 'Data Structures', room: 'Hall B', instructor: 'Dr. Rodriguez', type: 'Lecture' },
    { id: 3, day: 'Tuesday', time: '10:00 - 11:30', course: 'Database Systems', room: 'Lab 205', instructor: 'Prof. Chen', type: 'Practical' },
    { id: 4, day: 'Tuesday', time: '14:00 - 15:30', course: 'Web Dev Lab', room: 'Lab 301', instructor: 'Prof. Johnson', type: 'Lab' },
    { id: 5, day: 'Wednesday', time: '9:00 - 10:30', course: 'Web Development', room: 'Lab 301', instructor: 'Prof. Johnson', type: 'Lecture' },
    { id: 6, day: 'Wednesday', time: '13:00 - 14:30', course: 'Study Group', room: 'Library', instructor: 'Peer Mentors', type: 'Study' },
    { id: 7, day: 'Thursday', time: '10:00 - 11:30', course: 'Database Systems', room: 'Lab 205', instructor: 'Prof. Chen', type: 'Practical' },
    { id: 8, day: 'Friday', time: '11:00 - 12:30', course: 'Data Structures', room: 'Hall B', instructor: 'Dr. Rodriguez', type: 'Lecture' },
  ];
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00 - 10:30', '10:30 - 12:00', '12:00 - 13:00', '13:00 - 14:30', '14:30 - 16:00'];

  const getClassForTimeSlot = (day, timeSlot) => {
    return timetable.find(t => t.day === day && t.time === timeSlot);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Weekly Timetable</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Your daily class schedule with room and instructor details</p>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Time</th>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Monday</th>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Tuesday</th>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Wednesday</th>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Thursday</th>
                <th className="text-left py-3 px-3" style={{ color: colors.textSecondary }}>Friday</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, idx) => {
                return (
                  <tr key={idx} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td className="py-3 px-3 font-medium" style={{ color: colors.textPrimary }}>{timeSlot}</td>
                    {days.map(day => {
                      const classItem = getClassForTimeSlot(day, timeSlot);
                      return (
                        <td key={day} className="py-3 px-3">
                          {classItem ? (
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
                              <div className="font-medium text-sm" style={{ color: colors.textPrimary }}>{classItem.course}</div>
                              <div className="flex items-center gap-1 mt-1 text-xs">
                                <Clock size={10} style={{ color: colors.textSubtle }} />
                                <span style={{ color: colors.textSecondary }}>{classItem.room}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5 text-xs">
                                <User size={10} style={{ color: colors.textSubtle }} />
                                <span style={{ color: colors.textSecondary }}>{classItem.instructor}</span>
                              </div>
                              <span className="text-xs px-1 py-0.5 rounded mt-1 inline-block" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                                {classItem.type}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center text-xs" style={{ color: colors.textSubtle }}>—</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableSection;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Star, Users, ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';

const CourseCard = ({ course }) => {
  const { colors } = useTheme();
  const navigate = useNavigate();
  
  return (
    <GlassCard className="overflow-hidden cursor-pointer group" hover={false}>
      <div className="h-40 flex items-center justify-center text-6xl" style={{ backgroundColor: `${colors.primary}10` }}>
        {course.image}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
            {course.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={16} style={{ color: colors.primary }} />
            <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{course.rating}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          {course.title}
        </h3>
        <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
          {course.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
            <Users size={14} /> {course.students} students
          </div>
          <button 
            onClick={() => navigate(`/courses/${course.id}`)}
            className="flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
            style={{ color: colors.primary }}
          >
            Enroll Free <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default CourseCard;
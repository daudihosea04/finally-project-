import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Star } from 'lucide-react';
import GlassCard from './GlassCard';

const TestimonialCard = ({ name, role, text, rating, image }) => {
  const { colors } = useTheme();
  
  return (
    <GlassCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{image}</div>
        <div>
          <div className="font-bold" style={{ color: colors.textPrimary }}>{name}</div>
          <div className="text-sm" style={{ color: colors.textSubtle }}>{role}</div>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill={colors.primary} style={{ color: colors.primary }} />
        ))}
      </div>
      <p style={{ color: colors.textSecondary }}>"{text}"</p>
    </GlassCard>
  );
};

export default TestimonialCard;
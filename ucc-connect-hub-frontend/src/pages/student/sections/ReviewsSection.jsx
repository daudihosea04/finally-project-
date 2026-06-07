import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Star } from 'lucide-react';

const ReviewsSection = () => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('received');
  
  const receivedReviews = [
    { id: 1, student: 'Tessa Grey', date: 'October 27, 2022', rating: 4, comment: 'Quite a fun course but I wish we spent more time on certain topics.', course: 'Nutrition, Build Your Perfect Diet & Meal Plan', avatar: '👩‍🎓' },
    { id: 2, student: 'Vin M.', date: 'October 27, 2022', rating: 4, comment: 'I liked the course very much!', course: 'WordPress for Beginners – Master WordPress', avatar: '👨‍🎓' },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill={i < rating ? '#FFD700' : 'none'} style={{ color: '#FFD700' }} />
    ));
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Reviews</h1><p className="text-sm" style={{ color: colors.textSecondary }}>View feedback from students</p></div>
      
      <div className="flex gap-3 border-b" style={{ borderColor: colors.border }}>
        <button onClick={() => setActiveTab('received')} className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'received' ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === 'received' ? colors.primary : 'transparent', color: activeTab === 'received' ? colors.primary : colors.textSecondary }}>Received ({receivedReviews.length})</button>
        <button onClick={() => setActiveTab('given')} className={`px-4 py-2 rounded-t-lg transition-all ${activeTab === 'given' ? 'border-b-2' : ''}`} style={{ borderBottomColor: activeTab === 'given' ? colors.primary : 'transparent', color: activeTab === 'given' ? colors.primary : colors.textSecondary }}>Given (0)</button>
      </div>
      
      <div className="space-y-4">
        {receivedReviews.map((review, idx) => (
          <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: `${colors.primary}20` }}>{review.avatar}</div>
                <div>
                  <div className="font-bold" style={{ color: colors.textPrimary }}>{review.student}</div>
                  <div className="text-xs" style={{ color: colors.textSubtle }}>{review.date}</div>
                </div>
              </div>
              <div className="flex gap-1">{renderStars(review.rating)}</div>
            </div>
            <p className="mt-3 text-sm" style={{ color: colors.textSecondary }}>"{review.comment}"</p>
            <div className="mt-2 text-xs" style={{ color: colors.primary }}>Course: {review.course}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
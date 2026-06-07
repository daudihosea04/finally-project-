import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';

const WishlistSection = () => {
  const { colors } = useTheme();

  const wishlistItems = [
    { id: 1, title: 'Advanced React Patterns', instructor: 'Prof. Sarah Johnson', price: 49.99, rating: 4.8, image: '⚛️', enrolled: false },
    { id: 2, title: 'Machine Learning Fundamentals', instructor: 'Dr. Michael Chen', price: 59.99, rating: 4.9, image: '🤖', enrolled: false },
    { id: 3, title: 'Cloud Computing with AWS', instructor: 'Prof. Emily Rodriguez', price: 54.99, rating: 4.7, image: '☁️', enrolled: false },
  ];

  const totalPrice = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Wishlist</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Courses you've saved for later</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {wishlistItems.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-4" style={{ border: `1px solid ${colors.border}` }}>
              <div className="flex gap-4"><div className="text-5xl">{item.image}</div><div className="flex-1"><div className="flex justify-between items-start"><div><h3 className="font-bold" style={{ color: colors.textPrimary }}>{item.title}</h3><p className="text-sm" style={{ color: colors.textSecondary }}>{item.instructor}</p><div className="flex items-center gap-1 mt-1"><span className="text-yellow-500">★</span><span className="text-sm" style={{ color: colors.textPrimary }}>{item.rating}</span></div></div><button className="p-1 rounded" style={{ color: colors.error }}><Trash2 size={16} /></button></div><div className="flex justify-between items-center mt-3"><div className="text-lg font-bold" style={{ color: colors.primary }}>${item.price}</div><button className="px-4 py-1.5 rounded text-sm" style={{ backgroundColor: colors.primary, color: '#000' }}>Add to Cart</button></div></div></div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Summary</h2><div className="space-y-2"><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Items</span><span style={{ color: colors.textPrimary }}>{wishlistItems.length}</span></div><div className="flex justify-between"><span style={{ color: colors.textSecondary }}>Total Price</span><span className="text-xl font-bold" style={{ color: colors.primary }}>${totalPrice}</span></div><button className="w-full mt-4 py-2 rounded-lg" style={{ backgroundColor: colors.primary, color: '#000' }}>Add All to Cart</button></div></div>
      </div>
    </div>
  );
};

export default WishlistSection;
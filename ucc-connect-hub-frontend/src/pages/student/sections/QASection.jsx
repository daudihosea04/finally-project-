import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Send, MessageCircle } from 'lucide-react';

const QASection = () => {
  const { colors } = useTheme();
  const [newQuestion, setNewQuestion] = useState('');
  
  const questions = [
    { id: 1, question: 'Can you do a segment on vegetarian and plant-based diets?', course: 'Secret to Master Perfect Diet & Meal Plan', replies: 1, date: 'October 25, 2022', author: 'Student A' },
    { id: 2, question: 'Sorry but I missed what topics the next quiz is going to cover?', course: 'Project Management with Trello', replies: 0, date: 'October 24, 2022', author: 'Student B' },
    { id: 3, question: 'Hi, is AJAX going to be included in the midterm?', course: 'The Complete JavaScript Course 2019', replies: 1, date: 'October 23, 2022', author: 'Student C' },
  ];

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      alert('Question submitted successfully!');
      setNewQuestion('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Question & Answer</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>Ask questions and get answers from instructors</p>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Ask a Question</h2>
        <div className="flex gap-3">
          <textarea 
            rows={3} 
            placeholder="Type your question here..." 
            className="input-field flex-1" 
            style={{ border: `1px solid ${colors.border}` }} 
            value={newQuestion} 
            onChange={(e) => setNewQuestion(e.target.value)} 
          />
          <button 
            onClick={handleSubmitQuestion} 
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.primary, color: '#000' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <motion.div 
            key={q.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }} 
            className="glass-card p-5" 
            style={{ border: `1px solid ${colors.border}` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold" style={{ color: colors.textPrimary }}>{q.question}</div>
                <div className="flex gap-3 mt-2 text-sm">
                  <span style={{ color: colors.textSecondary }}>📚 {q.course}</span>
                  <span style={{ color: colors.textSecondary }}>👤 {q.author}</span>
                  <span style={{ color: colors.textSubtle }}>{q.date}</span>
                </div>
              </div>
              <button 
                className="px-3 py-1 rounded text-sm flex items-center gap-1" 
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
              >
                <MessageCircle size={14} /> Reply ({q.replies})
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QASection;
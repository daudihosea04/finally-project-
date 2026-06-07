import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Eye } from 'lucide-react';

const QuizAttemptsSection = () => {
  const { colors } = useTheme();
  
  const attempts = [
    { id: 1, date: 'October 28, 2022 9:00 am', quiz: 'Quiz 1', questions: 3, totalMarks: 10, correct: 2, incorrect: 1, earned: 9, percentage: 90, result: 'Pass' },
    { id: 2, date: 'October 28, 2022 8:59 am', quiz: 'Quiz 1', questions: 3, totalMarks: 10, correct: 2, incorrect: 1, earned: 6, percentage: 60, result: 'Pass' },
    { id: 3, date: 'October 28, 2022 8:34 am', quiz: 'Quiz 1', questions: 3, totalMarks: 10, correct: 3, incorrect: 0, earned: 10, percentage: 100, result: 'Pass' },
    { id: 4, date: 'October 28, 2022 8:32 am', quiz: 'Quiz 1', questions: 3, totalMarks: 10, correct: 2, incorrect: 1, earned: 7, percentage: 70, result: 'Pass' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>My Quiz Attempts</h1>
      <p className="text-sm" style={{ color: colors.textSecondary }}>View your quiz history and performance</p>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Quiz Info</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Questions</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Total Marks</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Correct</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Incorrect</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Earned</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Result</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, idx) => (
                <tr key={attempt.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td className="py-3">
                    <div>
                      <div className="font-medium" style={{ color: colors.textPrimary }}>{attempt.date}</div>
                      <div className="text-xs" style={{ color: colors.textSubtle }}>{attempt.quiz}</div>
                    </div>
                  </td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{attempt.questions}</td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{attempt.totalMarks}</td>
                  <td className="py-3"><span className="text-green-500">✓ {attempt.correct}</span></td>
                  <td className="py-3"><span className="text-red-500">✗ {attempt.incorrect}</span></td>
                  <td className="py-3">
                    <span style={{ color: attempt.percentage >= 80 ? '#32CD32' : attempt.percentage >= 60 ? '#FFD700' : '#FF6B6B' }}>
                      {attempt.earned} ({attempt.percentage}%)
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">{attempt.result}</span>
                  </td>
                  <td className="py-3">
                    <button className="text-sm" style={{ color: colors.primary }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptsSection;
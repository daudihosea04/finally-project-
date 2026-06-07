import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { FileText, Download, Upload, Eye, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

const AssignmentsSection = () => {
  const { colors } = useTheme();
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const assignments = [
    { id: 1, title: 'React.js Final Project', course: 'Web Development', dueDate: '2024-03-25', status: 'pending', points: 100, submitted: false, description: 'Build a full-stack application using React and Node.js', type: 'Project', attachment: 'project_instructions.pdf' },
    { id: 2, title: 'Database Normalization', course: 'Database Systems', dueDate: '2024-03-20', status: 'graded', points: 95, grade: 95, feedback: 'Excellent work! Great understanding of normalization.', submitted: true, type: 'Assignment', attachment: 'normalization_task.pdf' },
    { id: 3, title: 'Sorting Algorithm Implementation', course: 'Data Structures', dueDate: '2024-03-22', status: 'pending', points: 100, submitted: false, description: 'Implement and compare sorting algorithms', type: 'Lab', attachment: 'algorithms.pdf' },
  ];

  const handleDownload = (attachment) => {
    alert(`Downloading ${attachment}...`);
  };

  const handleSubmit = () => {
    alert('Assignment submitted successfully!');
    setShowSubmitModal(null);
    setSelectedFile(null);
  };

  const getStatusColor = (status) => status === 'graded' ? '#32CD32' : status === 'pending' ? '#FFD700' : '#FF6B6B';
  const getStatusText = (status) => status === 'graded' ? 'Graded' : status === 'pending' ? 'Pending' : 'Late';

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Assignments</h1><p className="text-sm" style={{ color: colors.textSecondary }}>View, download, and submit your assignments</p></div>
      
      <div className="grid grid-cols-1 gap-4">
        {assignments.map((assignment, idx) => (
          <motion.div key={assignment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-card p-5 hover:scale-102 transition-all" style={{ border: `1px solid ${colors.border}` }}>
            <div className="flex justify-between items-start flex-wrap gap-3"><div><div className="flex items-center gap-2"><FileText size={20} style={{ color: colors.primary }} /><h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{assignment.title}</h3></div><p className="text-sm mt-1" style={{ color: colors.textSecondary }}>{assignment.course} • {assignment.type}</p></div><span className={`text-xs px-3 py-1 rounded-full`} style={{ backgroundColor: `${getStatusColor(assignment.status)}20`, color: getStatusColor(assignment.status) }}>{getStatusText(assignment.status)}</span></div>
            <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>{assignment.description}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm"><div className="flex items-center gap-1"><Clock size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>Due: {assignment.dueDate}</span></div><div className="flex items-center gap-1"><FileText size={14} style={{ color: colors.textSubtle }} /><span style={{ color: colors.textSecondary }}>{assignment.points} points</span></div>{assignment.grade && (<div className="flex items-center gap-1"><CheckCircle size={14} style={{ color: '#32CD32' }} /><span style={{ color: '#32CD32' }}>Grade: {assignment.grade}%</span></div>)}</div>
            {assignment.feedback && (<div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><p className="text-sm" style={{ color: colors.textPrimary }}>📝 Feedback: {assignment.feedback}</p></div>)}
            <div className="mt-4 flex gap-2"><button onClick={() => handleDownload(assignment.attachment)} className="flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}><Download size={14} /> Download</button>{!assignment.submitted ? (<button onClick={() => setShowSubmitModal(assignment)} className="flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}><Upload size={14} /> Submit</button>) : (<button className="flex-1 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-all hover:scale-105" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}><Eye size={14} /> View Submission</button>)}</div>
          </motion.div>
        ))}
      </div>
      
      {/* Submit Modal */}
      {showSubmitModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSubmitModal(null)}><div className="glass-card p-6 max-w-md w-full" style={{ border: `1px solid ${colors.border}` }} onClick={(e) => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Submit Assignment</h3><button onClick={() => setShowSubmitModal(null)}><X size={20} style={{ color: colors.textSecondary }} /></button></div><div className="space-y-4"><div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}><p className="font-medium" style={{ color: colors.textPrimary }}>{showSubmitModal.title}</p><p className="text-sm" style={{ color: colors.textSecondary }}>{showSubmitModal.course}</p></div><div className="border-2 border-dashed rounded-lg p-6 text-center hover:scale-102 transition-all cursor-pointer" style={{ borderColor: colors.border }} onClick={() => document.getElementById('file-upload').click()}><Upload size={32} style={{ color: colors.primary }} className="mx-auto mb-2" /><p className="text-sm" style={{ color: colors.textSecondary }}>Click or drag file to upload</p><input type="file" id="file-upload" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />{selectedFile && <p className="text-xs mt-2" style={{ color: colors.primary }}>✓ Selected: {selectedFile.name}</p>}</div><button onClick={handleSubmit} className="w-full py-2 rounded-lg transition-all hover:scale-105" style={{ backgroundColor: colors.primary, color: '#000' }}>Submit Assignment</button></div></div></div>)}
    </div>
  );
};

export default AssignmentsSection;
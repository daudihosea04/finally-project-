import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Download, Eye, Search } from 'lucide-react';

const Resources = () => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const resources = [
    { id: 1, title: 'Complete Study Guide 2025/2026', type: 'PDF', downloads: 1234, views: 5234, size: '2.4 MB', icon: '📄' },
    { id: 2, title: 'Programming Fundamentals - Notes', type: 'PDF', downloads: 892, views: 3456, size: '1.8 MB', icon: '📘' },
    { id: 3, title: 'Research Paper Template', type: 'DOCX', downloads: 2100, views: 7890, size: '0.5 MB', icon: '📝' },
    { id: 4, title: 'Database Systems Tutorials', type: 'Video', downloads: 567, views: 2341, size: '450 MB', icon: '🎥' },
    { id: 5, title: 'Past Paper: CS101 Final Exam', type: 'PDF', downloads: 345, views: 1234, size: '0.3 MB', icon: '📄' },
  ];

  const filtered = resources.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen py-20 px-4" style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.textPrimary }}>Digital <span style={{ color: colors.primary }}>Library</span></h1>
          <p className="text-xl" style={{ color: colors.textSecondary }}>Free learning materials for all UCC students</p>
        </div>

        <div className="relative mb-8 max-w-md mx-auto">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
          <input type="text" placeholder="Search resources..." className="w-full pl-10 pr-3 py-2 rounded-lg border" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div key={res.id} className="glass-card p-5 rounded-xl" style={{ border: `1px solid ${colors.border}` }}>
              <div className="text-4xl mb-3">{res.icon}</div>
              <h3 className="font-bold mb-1" style={{ color: colors.textPrimary }}>{res.title}</h3>
              <p className="text-xs mb-2" style={{ color: colors.textSubtle }}>{res.type} • {res.size}</p>
              <div className="flex justify-between items-center">
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1"><Download size={12} /> {res.downloads}</div>
                  <div className="flex items-center gap-1"><Eye size={12} /> {res.views}</div>
                </div>
                <button className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: colors.primary, color: '#000' }}>Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
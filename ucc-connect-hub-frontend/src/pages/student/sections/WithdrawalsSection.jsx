import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { DollarSign, Plus, Eye, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

const WithdrawalsSection = () => {
  const { colors } = useTheme();
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const withdrawals = [
    { id: 1, amount: 500, date: '2024-03-15', status: 'completed', method: 'Bank Transfer', account: '****1234' },
    { id: 2, amount: 250, date: '2024-03-01', status: 'completed', method: 'PayPal', account: 'instructor@email.com' },
    { id: 3, amount: 300, date: '2024-02-15', status: 'pending', method: 'Bank Transfer', account: '****1234' },
  ];
  
  const balance = {
    available: 12450.75,
    pending: 300,
    total: 12750.75,
    totalWithdrawn: 4520,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><div><h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Withdrawals</h1><p className="text-sm" style={{ color: colors.textSecondary }}>Manage your earnings and withdrawal requests</p></div><button onClick={() => setShowRequestModal(true)} className="px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: colors.primary, color: '#000' }}><Plus size={16} /> Request Withdrawal</button></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}><DollarSign size={24} style={{ color: '#32CD32' }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${balance.available.toLocaleString()}</div><div className="text-sm">Available Balance</div></div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}><Clock size={24} style={{ color: '#FFD700' }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${balance.pending.toLocaleString()}</div><div className="text-sm">Pending</div></div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}><DollarSign size={24} style={{ color: colors.primary }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${balance.total.toLocaleString()}</div><div className="text-sm">Total Earnings</div></div>
        <div className="glass-card p-5 text-center" style={{ border: `1px solid ${colors.border}` }}><Download size={24} style={{ color: '#00E5FF' }} className="mx-auto mb-2" /><div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>${balance.totalWithdrawn.toLocaleString()}</div><div className="text-sm">Total Withdrawn</div></div>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}><h2 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>Withdrawal History</h2><div className="space-y-3">{withdrawals.map((w, idx) => (<div key={w.id} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}><div><div className="font-bold" style={{ color: colors.textPrimary }}>${w.amount}</div><div className="text-xs" style={{ color: colors.textSecondary }}>{w.date} • {w.method}</div></div><div className="flex items-center gap-3"><span className={`text-xs px-2 py-1 rounded-full ${w.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{w.status === 'completed' ? 'Completed' : 'Pending'}</span><button className="text-sm" style={{ color: colors.primary }}><Eye size={16} /></button></div></div>))}</div>
      </div>
    </div>
  );
};

export default WithdrawalsSection;
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Download } from 'lucide-react';

const OrderHistorySection = () => {
  const { colors } = useTheme();
  
  const orders = [
    { id: '#ORD-001', date: 'March 15, 2024', course: 'Advanced Web Development', amount: 49.99, status: 'Completed', payment: 'Credit Card' },
    { id: '#ORD-002', date: 'March 10, 2024', course: 'Database Systems', amount: 39.99, status: 'Completed', payment: 'PayPal' },
    { id: '#ORD-003', date: 'March 5, 2024', course: 'Data Structures', amount: 44.99, status: 'Pending', payment: 'Bank Transfer' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Order History</h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>View your purchase history</p>
      </div>
      
      <div className="glass-card p-5" style={{ border: `1px solid ${colors.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Order ID</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Date</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Course</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Amount</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Status</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Payment</th>
                <th className="text-left py-3" style={{ color: colors.textSecondary }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td className="py-3" style={{ color: colors.textPrimary }}>{order.id}</td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{order.date}</td>
                  <td className="py-3" style={{ color: colors.textPrimary }}>{order.course}</td>
                  <td className="py-3" style={{ color: colors.primary }}>${order.amount}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3" style={{ color: colors.textSecondary }}>{order.payment}</td>
                  <td className="py-3">
                    <button className="p-1 rounded" style={{ color: colors.primary }}>
                      <Download size={16} />
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

export default OrderHistorySection;
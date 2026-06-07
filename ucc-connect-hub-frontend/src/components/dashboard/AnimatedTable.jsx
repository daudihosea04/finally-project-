import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

const AnimatedTable = ({ columns, data, onRowClick, searchable = true, itemsPerPage = 5 }) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.textSubtle }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: `${colors.primary}05`,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
          >
            <Filter size={18} />
          </motion.button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => handleSort(col.key)}
                  className="text-left py-3 px-3 cursor-pointer hover:opacity-70 transition"
                  style={{ color: colors.textSecondary }}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </td>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {paginatedData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onRowClick?.(row)}
                  className="cursor-pointer hover:bg-opacity-5 transition"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                  whileHover={{ backgroundColor: `${colors.primary}10` }}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3 px-3" style={{ color: colors.textSecondary }}>
                      {row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg disabled:opacity-50"
            style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
          >
            Previous
          </motion.button>
          <span className="px-3 py-1" style={{ color: colors.textSecondary }}>
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg disabled:opacity-50"
            style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default AnimatedTable;
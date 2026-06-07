import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const LoaderSpinner = () => {
  const { colors } = useTheme();
  
  return (
    <div className="flex justify-center items-center h-full">
      <div
        className="w-12 h-12 border-4 rounded-full animate-spin"
        style={{
          borderColor: `${colors.primary}20`,
          borderTopColor: colors.primary,
        }}
      />
    </div>
  );
};

export default LoaderSpinner;
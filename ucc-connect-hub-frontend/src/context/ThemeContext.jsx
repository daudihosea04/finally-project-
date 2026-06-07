import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme or system preference
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // NEW COLOR PALETTE - High contrast, visible in both modes
  const colors = {
    dark: {
      // Primary & Secondary
      primary: '#FFD700',        // Bright Gold
      primaryDark: '#DAA520',    // Darker Gold
      primaryLight: '#FFED4A',   // Light Gold
      secondary: '#00E5FF',      // Bright Cyan
      secondaryDark: '#00B8D4',  // Darker Cyan
      
      // Backgrounds
      background: '#0A0E17',      // Deep Navy
      backgroundDarker: '#06080F', // Darker Navy
      backgroundCard: '#1A1F2E',   // Dark Slate
      
      // Text Colors (High contrast)
      textPrimary: '#FFFFFF',      // Pure White
      textSecondary: '#B0B8D0',    // Light Gray-Blue
      textSubtle: '#7A82A0',       // Muted Blue
      
      // UI Elements
      border: 'rgba(255, 215, 0, 0.25)',  // Gold border
      glow: 'rgba(255, 215, 0, 0.08)',    // Subtle glow
      success: '#00E676',
      error: '#FF5252',
      warning: '#FFC107',
      info: '#448AFF',
    },
    light: {
      // Primary & Secondary
      primary: '#D4AF37',        // Metallic Gold (darker for contrast)
      primaryDark: '#B8960C',    // Dark Gold
      primaryLight: '#FFE066',   // Light Gold
      secondary: '#0077B6',      // Deep Blue
      secondaryDark: '#023E8A',  // Darker Blue
      
      // Backgrounds
      background: '#F8F9FA',      // Off-white
      backgroundDarker: '#E9ECEF', // Light Gray
      backgroundCard: '#FFFFFF',   // Pure White
      
      // Text Colors (High contrast)
      textPrimary: '#1A1F2E',     // Deep Navy (dark for contrast)
      textSecondary: '#5A626E',   // Medium Gray
      textSubtle: '#8E9AAB',      // Light Gray
      
      // UI Elements
      border: 'rgba(0, 0, 0, 0.1)',     // Subtle border
      glow: 'rgba(212, 175, 55, 0.05)', // Subtle gold glow
      success: '#2E7D32',
      error: '#D32F2F',
      warning: '#F57C00',
      info: '#1976D2',
    }
  };

  const value = {
    theme,
    toggleTheme,
    colors: colors[theme],
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePublicData } from '@/hooks/usePublicData';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const { settingsQuery } = usePublicData();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Apply dynamic theme colors if available
    const settings: any = settingsQuery.data || {};
    const themeColors = settings.theme_colors;
    
    if (themeColors) {
      if (themeColors.primary) {
        root.style.setProperty('--primary', themeColors.primary);
      }
      if (themeColors.secondary) {
        root.style.setProperty('--secondary', themeColors.secondary);
      }
    }
  }, [theme, settingsQuery.data]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

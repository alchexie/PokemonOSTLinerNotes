import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const isMobile = window.matchMedia('(pointer: coarse)').matches;

export const useTheme = () => {
  const localTheme = localStorage.getItem('theme') as Theme;

  const [isManual, setIsManual] = useState<boolean>(!!localTheme);
  const [theme, setTheme] = useState<Theme>(
    !isMobile
      ? !isManual
        ? 'light'
        : localTheme
      : (localTheme ??
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  );

  useEffect(() => {
    console.log(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isMobile || isManual) {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isManual]);

  const toggleTheme = useCallback(() => {
    if (isMobile) {
      return;
    }
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsManual(true);
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  return { theme, toggleTheme };
};

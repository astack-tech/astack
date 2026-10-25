'use client';

import { ThemeProvider as Provider, useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { AnimatedThemeToggler } from './magicui/animated-theme-toggler';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </Provider>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <AnimatedThemeToggler
      className="theme-toggle"
      theme={mounted && resolvedTheme === 'dark' ? 'dark' : 'light'}
      onThemeChange={setTheme}
      aria-label={
        mounted && resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      }
      title="Switch appearance"
      duration={350}
    />
  );
}

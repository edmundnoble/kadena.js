import { EVENT_NAMES, analyticsEvent } from '@/utils/analytics';
import { NavHeaderButton, SystemIcon } from '@kadena/react-ui';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

export const ThemeToggle: FC = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    analyticsEvent(EVENT_NAMES['click:change_theme'], {
      theme: newTheme,
    });
  };

  if (!isMounted) return null;

  return (
    <NavHeaderButton
      onClick={toggleTheme}
      title="Go to our Twitter"
      aria-label="Go to our Twitter"
      icon={<SystemIcon.ThemeLightDark />}
    />
  );
};

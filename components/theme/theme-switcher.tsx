'use client';

import { MoonIcon, SunIcon } from '@navikt/aksel-icons';
import { Button, Theme, Tooltip } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { isThemeEnum, THEME_KEY, ThemeEnum } from '@/components/theme/common';

interface Props {
  serverTheme: ThemeEnum | null;
  children: React.ReactNode;
}

const IS_CLIENT = typeof window !== 'undefined';
const SUPPORTS_MATCH_MEDIA = IS_CLIENT && 'matchMedia' in window;

const getDarkModeQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const getPreferredTheme = (): ThemeEnum => (getDarkModeQuery().matches ? ThemeEnum.DARK : ThemeEnum.LIGHT);

export const ThemeSwitcher = ({ serverTheme, children }: Props) => {
  const [theme, setTheme] = useState<ThemeEnum>(serverTheme ?? getPreferredTheme());
  const isDarkMode = theme === ThemeEnum.DARK;

  // Update the theme cookie whenever the theme changes and on initial load.
  useEffect(() => {
    cookieStore.set(THEME_KEY, theme);
  }, [theme]);

  // Listen for changes in the user's preferred color scheme.
  useEffect(() => {
    if (!SUPPORTS_MATCH_MEDIA) {
      return;
    }

    const darkModeQuery = getDarkModeQuery();

    const mediaQueryListener = (event: MediaQueryListEvent) =>
      setTheme(event.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT);

    const cookieStoreListener = (event: CookieChangeEvent) => {
      const newValue = event.changed.find((cookie) => cookie.name === THEME_KEY)?.value;

      if (newValue !== undefined && isThemeEnum(newValue)) {
        setTheme(newValue);
      } else {
        // Fallback to the preferred theme if the cookie value is invalid or deleted.
        setTheme(getPreferredTheme());
      }
    };

    darkModeQuery.addEventListener('change', mediaQueryListener);
    cookieStore.addEventListener('change', cookieStoreListener);

    return () => {
      darkModeQuery.removeEventListener('change', mediaQueryListener);
      cookieStore.removeEventListener('change', cookieStoreListener);
    };
  }, []);

  return (
    <Theme theme={theme}>
      {children}

      <Tooltip
        content={`Bytt til ${isDarkMode ? THEME_NAME[ThemeEnum.LIGHT] : THEME_NAME[ThemeEnum.DARK]} tema`}
        className="whitespace-nowrap"
      >
        <Button
          size="small"
          variant="tertiary-neutral"
          onClick={() => setTheme(isDarkMode ? ThemeEnum.LIGHT : ThemeEnum.DARK)}
          icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
          className="fixed bottom-5 left-4 z-50"
          suppressHydrationWarning
        />
      </Tooltip>
    </Theme>
  );
};

const THEME_NAME: Record<ThemeEnum, string> = {
  [ThemeEnum.DARK]: 'Mørkt',
  [ThemeEnum.LIGHT]: 'Lyst',
};

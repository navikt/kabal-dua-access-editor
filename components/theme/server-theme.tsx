'use server';

import { cookies } from 'next/headers';
import { isThemeEnum, THEME_KEY, type ThemeEnum } from '@/components/theme/common';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';

interface Props {
  children: React.ReactNode;
}

export const ServerTheme = async ({ children }: Props) => {
  const theme = await getServerCookie(THEME_KEY);

  return <ThemeSwitcher serverTheme={theme}>{children}</ThemeSwitcher>;
};

const getServerCookie = async (key: string): Promise<ThemeEnum | null> => {
  const cookie = (await cookies()).get(key);

  if (cookie === undefined) {
    return null;
  }

  const { value } = cookie;

  return isThemeEnum(value) ? value : null;
};

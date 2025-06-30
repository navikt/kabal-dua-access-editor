export const THEME_KEY = 'kabal-dua-access-editor-theme';

export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export const isThemeEnum = (value: string): value is ThemeEnum => value === ThemeEnum.DARK || value === ThemeEnum.LIGHT;

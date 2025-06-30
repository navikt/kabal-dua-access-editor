import type { TagProps } from '@navikt/ds-react';

export enum UserEnum {
  /** Bruker med sakesbehandler-rolle. */
  SAKSBEHANDLER = 'SAKSBEHANDLER',
  /** Bruker som er tildelt saken. */
  TILDELT_SAKSBEHANDLER = 'TILDELT_SAKSBEHANDLER',

  /** Bruker som er medunderskriver på saken. */
  TILDELT_MEDUNDERSKRIVER = 'TILDELT_MEDUNDERSKRIVER',

  /** Bruker med Azure-rollen for ROL. */
  ROL = 'ROL',
  /** Bruker som er satt som ROL i saken. */
  TILDELT_ROL = 'TILDELT_ROL',
}

export const USER_VALUES = Object.values(UserEnum);

export const isUser = (value: string | undefined): value is UserEnum =>
  value !== undefined && USER_VALUES.includes(value as UserEnum);

export const USER_NAMES: Record<UserEnum, string> = {
  [UserEnum.SAKSBEHANDLER]: 'Saksbehandler',
  [UserEnum.TILDELT_SAKSBEHANDLER]: 'Tildelt saksbehandler',
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: 'Tildelt MU',
  [UserEnum.ROL]: 'ROL',
  [UserEnum.TILDELT_ROL]: 'Tildelt ROL',
};

export const USER_COLORS: Record<UserEnum, TagProps['variant']> = {
  [UserEnum.SAKSBEHANDLER]: 'info',
  [UserEnum.TILDELT_SAKSBEHANDLER]: 'info-moderate',
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: 'warning-moderate',
  [UserEnum.ROL]: 'alt1',
  [UserEnum.TILDELT_ROL]: 'alt1-moderate',
};

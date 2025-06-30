import type { TagProps } from '@navikt/ds-react';

export enum CreatorEnum {
  KABAL_SAKSBEHANDLING = 'KABAL_SAKSBEHANDLING',
  KABAL_ROL = 'KABAL_ROL',
  KABAL_MEDUNDERSKRIVER = 'KABAL_MEDUNDERSKRIVER',
  NONE = 'NONE',
}

export const CREATOR_VALUES = Object.values(CreatorEnum);

export const isCreator = (value: string | undefined): value is CreatorEnum =>
  value !== undefined && CREATOR_VALUES.includes(value as CreatorEnum);

export const CREATOR_NAMES: Record<CreatorEnum, string> = {
  [CreatorEnum.KABAL_SAKSBEHANDLING]: 'Saksbehandler',
  [CreatorEnum.KABAL_MEDUNDERSKRIVER]: 'Medunderskriver',
  [CreatorEnum.KABAL_ROL]: 'ROL',
  [CreatorEnum.NONE]: 'Uten rolle i saken',
};

export const CREATOR_COLORS: Record<CreatorEnum, TagProps['variant']> = {
  [CreatorEnum.NONE]: 'neutral-moderate',
  [CreatorEnum.KABAL_SAKSBEHANDLING]: 'info-moderate',
  [CreatorEnum.KABAL_MEDUNDERSKRIVER]: 'warning-moderate',
  [CreatorEnum.KABAL_ROL]: 'alt1-moderate',
};

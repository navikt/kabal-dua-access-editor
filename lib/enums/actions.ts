import type { TagProps } from '@navikt/ds-react';

export enum ActionEnum {
  /** Opprette dokument/vedlegg. */
  CREATE = 'CREATE',
  /** Skrive i smartdokument/-vedlegg. */
  WRITE = 'WRITE',
  /** Fjerne dokument eller vedlegg. */
  REMOVE = 'REMOVE',
  /** Endre type på dokument. */
  CHANGE_TYPE = 'CHANGE_TYPE',
  /** Endre navn på dokument eller vedlegg. */
  RENAME = 'RENAME',
  /** Arkivere / sende ut dokument. */
  FINISH = 'FINISH',
}

export const ACTION_VALUES = Object.values(ActionEnum);

export const isAction = (value: unknown): value is ActionEnum => ACTION_VALUES.includes(value as ActionEnum);

export const ACTION_NAMES: Record<ActionEnum, string> = {
  [ActionEnum.CREATE]: 'Opprette',
  [ActionEnum.WRITE]: 'Skrive i innholdet i',
  [ActionEnum.REMOVE]: 'Slette/fjerne',
  [ActionEnum.CHANGE_TYPE]: 'Endre type på',
  [ActionEnum.RENAME]: 'Endre navn på',
  [ActionEnum.FINISH]: 'Arkivere / sende ut',
};

export const ACTION_COLORS: Record<ActionEnum, TagProps['variant']> = {
  [ActionEnum.CREATE]: 'success-moderate',
  [ActionEnum.WRITE]: 'info-moderate',
  [ActionEnum.REMOVE]: 'error-moderate',
  [ActionEnum.CHANGE_TYPE]: 'warning-moderate',
  [ActionEnum.RENAME]: 'warning-moderate',
  [ActionEnum.FINISH]: 'alt1-moderate',
};

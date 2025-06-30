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
  [ActionEnum.REMOVE]: 'Fjerne',
  [ActionEnum.CHANGE_TYPE]: 'Endre type på',
  [ActionEnum.RENAME]: 'Endre navn på',
  [ActionEnum.FINISH]: 'Arkivere / sende ut',
};

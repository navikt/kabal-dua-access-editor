export enum Access {
  ALLOWED = 'ALLOWED',
  NOT_ASSIGNED = 'NOT_ASSIGNED',
  NOT_ASSIGNED_OR_MEDUNDERSKRIVER = 'NOT_ASSIGNED_OR_MEDUNDERSKRIVER',
  NOT_ASSIGNED_OR_ROL = 'NOT_ASSIGNED_OR_ROL',
  NOT_ASSIGNED_ROL = 'NOT_ASSIGNED_ROL',
  ROL_REQUIRED = 'ROL_REQUIRED',
  SENT_TO_MU = 'SENT_TO_MU',
  SENT_TO_ROL = 'SENT_TO_ROL',
  SENT_TO_MU_AND_ROL = 'SENT_TO_MU_AND_ROL',
  ROL_USER = 'ROL_USER',
  ROL_QUESTIONS = 'ROL_QUESTIONS',
  OTHERS_ATTACHMENTS = 'OTHERS_ATTACHMENTS',
  NOT_SUPPORTED = 'NOT_SUPPORTED',

  /** The value is not set. */
  UNSET = 'UNSET',
}

export const ACCESS_VALUES = Object.values(Access);

export const isAccess = (value: unknown): value is Access => ACCESS_VALUES.includes(value as Access);

export const ACCESS_NAMES: Record<Access, string> = {
  [Access.ALLOWED]: 'Tillatt',
  [Access.NOT_ASSIGNED]: 'Kun tildelt saksbehandler',
  [Access.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]: 'Kun tildelt saksbehandler eller tilsendt MU',
  [Access.NOT_ASSIGNED_ROL]: 'Kun tilsendt ROL',
  [Access.NOT_ASSIGNED_OR_ROL]: 'Kun tildelt saksbehandler eller tilsendt ROL',
  [Access.ROL_REQUIRED]: 'ROL må returnere saken først',
  [Access.SENT_TO_MU]: 'Sendt til MU',
  [Access.SENT_TO_ROL]: 'Sendt til ROL',
  [Access.SENT_TO_MU_AND_ROL]: 'Sendt til både MU og ROL',
  [Access.ROL_USER]: 'ROL-bruker',
  [Access.ROL_QUESTIONS]: 'ROL-spørsmål',
  [Access.OTHERS_ATTACHMENTS]: 'Vedlegg eid av andre',
  [Access.NOT_SUPPORTED]: 'Ikke mulig',

  [Access.UNSET]: 'Velg tilgang',
};

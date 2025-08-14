export enum Access {
  ALLOWED = 'ALLOWED',
  NOT_ASSIGNED = 'NOT_ASSIGNED',
  NOT_ASSIGNED_OR_MU = 'NOT_ASSIGNED_OR_MU',
  NOT_ASSIGNED_OR_ROL = 'NOT_ASSIGNED_OR_ROL',
  NOT_ASSIGNED_ROL = 'NOT_ASSIGNED_ROL',
  ROL_REQUIRED = 'ROL_REQUIRED',
  SENT_TO_MU = 'SENT_TO_MU',
  SENT_TO_ROL = 'SENT_TO_ROL',
  SENT_TO_MU_AND_ROL = 'SENT_TO_MU_AND_ROL',
  ROL_USER = 'ROL_USER',
  RETURNED_FROM_ROL = 'RETURNED_FROM_ROL',
  NOT_SUPPORTED_ROL_QUESTIONS = 'NOT_SUPPORTED_ROL_QUESTIONS',
  NOT_SUPPORTED_ROL_ANSWERS = 'NOT_SUPPORTED_ROL_ANSWERS',
  NOT_SUPPORTED_JOURNALFOERT = 'NOT_SUPPORTED_JOURNALFOERT',
  NOT_SUPPORTED_ATTACHMENT = 'NOT_SUPPORTED_ATTACHMENT',
  NOT_SUPPORTED_UPLOADED = 'NOT_SUPPORTED_UPLOADED',
  NOT_SUPPORTED_FINISHED = 'NOT_SUPPORTED_FINISHED',
  NOT_SUPPORTED = 'NOT_SUPPORTED',

  /** The value is not set. */
  UNSET = 'UNSET',
}

export const ACCESS_VALUES = Object.values(Access);

export const isAccess = (value: unknown): value is Access => ACCESS_VALUES.includes(value as Access);

export const ACCESS_NAMES: Record<Access, string> = {
  [Access.ALLOWED]: 'Tillatt',
  [Access.NOT_ASSIGNED]: 'Kun tildelt saksbehandler',
  [Access.NOT_ASSIGNED_OR_MU]: 'Kun tildelt saksbehandler eller tilsendt MU',
  [Access.NOT_ASSIGNED_ROL]: 'Kun tilsendt ROL',
  [Access.NOT_ASSIGNED_OR_ROL]: 'Kun tildelt saksbehandler eller tilsendt ROL',
  [Access.ROL_REQUIRED]: 'ROL må returnere saken først',
  [Access.SENT_TO_MU]: 'Sendt til MU',
  [Access.SENT_TO_ROL]: 'Sendt til ROL',
  [Access.SENT_TO_MU_AND_ROL]: 'Sendt til både MU og ROL',
  [Access.ROL_USER]: 'Ikke mulig for ROL-bruker',
  [Access.RETURNED_FROM_ROL]: 'Ikke mulig når returnert fra ROL',
  [Access.NOT_SUPPORTED_ROL_QUESTIONS]: 'Ikke mulig for Spørsmål til ROL',
  [Access.NOT_SUPPORTED_ROL_ANSWERS]: 'Ikke mulig for Svar fra ROL',
  [Access.NOT_SUPPORTED_JOURNALFOERT]: 'Ikke mulig for journalført',
  [Access.NOT_SUPPORTED_ATTACHMENT]: 'Ikke mulig for vedlegg',
  [Access.NOT_SUPPORTED_UPLOADED]: 'Ikke mulig for opplastet',
  [Access.NOT_SUPPORTED_FINISHED]: 'Ikke mulig for ferdigstilt sak',
  [Access.NOT_SUPPORTED]: 'Ikke mulig',

  [Access.UNSET]: 'Velg tilgang',
};

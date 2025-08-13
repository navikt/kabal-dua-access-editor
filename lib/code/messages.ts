import { ACCESS_VALUES, Access } from '@/lib/enums/access';
import { ACTION_NAMES, ACTION_VALUES, type ActionEnum } from '@/lib/enums/actions';

const MESSAGE_FUNCTIONS: Record<Access, (action: ActionEnum) => string> = {
  [Access.ALLOWED]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet. Teknisk feil. Kontakt Team Klage.`,
  [Access.NOT_SUPPORTED]: (action) => `Det er umulig å ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.NOT_ASSIGNED]: (action) => `Kun tildelt saksbehandler kan ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]: (action) =>
    `Kun tildelt saksbehandler eller tilsendt medunderskriver kan ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.NOT_ASSIGNED_ROL]: (action) => `Kun tilsendt ROL kan ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.NOT_ASSIGNED_OR_ROL]: (action) =>
    `Kun tildelt saksbehandler eller tilsendt ROL kan ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.ROL_REQUIRED]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet før ROL har returnert saken.`,
  [Access.SENT_TO_MU]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi saken er sendt til medunderskriver.`,
  [Access.SENT_TO_ROL]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi saken er sendt til ROL.`,
  [Access.SENT_TO_MU_AND_ROL]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi saken er sendt til både MU og ROL.`,
  [Access.ROL_USER]: (action) => `ROL kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet.`,
  [Access.ROL_QUESTIONS]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi det er spørsmål til ROL.`,
  [Access.OTHERS_ATTACHMENTS]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi det har vedlegg fra andre.`,
  [Access.UNSET]: (action) =>
    `Kan ikke ${ACTION_NAMES[action].toLowerCase()} dokumentet fordi tilgangen ikke er satt opp riktig. Kontakt Team Klage.`,
};

interface ErrorMessage {
  key: string;
  message: string;
}

export const ERROR_MESSAGES: ErrorMessage[] = ACTION_VALUES.flatMap((action) =>
  ACCESS_VALUES.map((access) => ({
    key: `${access}:${action}`,
    message: MESSAGE_FUNCTIONS[access](action),
  })),
);

import { rowToEntries } from '@/lib/code/entries';
import { ERROR_MESSAGES } from '@/lib/code/messages';
import type { ParsedCsv } from '@/lib/data';
import { ACCESS_VALUES, Access } from '@/lib/enums/access';
import { ACTION_VALUES } from '@/lib/enums/actions';
import { CASE_STATUS_VALUES } from '@/lib/enums/case-status';
import { CREATOR_VALUES } from '@/lib/enums/creator';
import { DOCUMENT_TYPE_VALUES } from '@/lib/enums/document-type';
import { PARENT_VALUES } from '@/lib/enums/parent';
import { USER_VALUES } from '@/lib/enums/user';

const USER_ENUM_NAME = 'DuaAccessUser';
const CASE_STATUS_ENUM_NAME = 'DuaAccessCaseStatus';
const DOCUMENT_TYPE_ENUM_NAME = 'DuaAccessDocumentType';
const PARENT_ENUM_NAME = 'DuaAccessParent';
const CREATOR_ENUM_NAME = 'DuaAccessCreator';
const ACTION_ENUM_NAME = 'DuaActionEnum';
const ACCESS_ENUM_NAME = 'DuaAccessEnum';

export const accessToTypeScript = (access: ParsedCsv) => {
  const { rows } = access;

  const mapLines = rows.reduce<string[]>(
    (acc, row) => acc.concat(rowToEntries(row, (key, value) => `'${key}': ${ACCESS_ENUM_NAME}.${value}`)),
    [],
  );

  return `
export const FINISHED_ERROR = 'Ferdigstilt dokument kan ikke endres. Kontakt Team Klage.';

export const getDuaAccessError = (
  user: ${USER_ENUM_NAME},
  caseStatus: ${CASE_STATUS_ENUM_NAME},
  documentType: ${DOCUMENT_TYPE_ENUM_NAME},
  parent: ${PARENT_ENUM_NAME},
  creator: ${CREATOR_ENUM_NAME},
  action: ${ACTION_ENUM_NAME},
): string | null => {
  const key = \`\${user}:\${caseStatus}:\${documentType}:\${parent}:\${creator}:\${action}\`;
  const access = ACCESS_MAP[key];
  
  if (access === undefined) {
    return \`"\${key}"\ skal ikke være mulig. Kontakt Team Klage.\`;
  }

  if (access === ${ACCESS_ENUM_NAME}.${Access.ALLOWED}) {
    return null;
  }
  
  return ERROR_MESSAGE_MAP[\`\${access}:\${action}\`] ?? null;
};

${USER_ENUM}

${CASE_STATUS_ENUM}

${DOCUMENT_TYPE_ENUM}

${PARENT_ENUM}

${CREATOR_ENUM}

${ACTION_ENUM}

export const DUA_ACTION_VALUES = Object.values(${ACTION_ENUM_NAME});

${ACCESS_ENUM}

// ${mapLines.length} entries
const ACCESS_MAP: Record<string, ${ACCESS_ENUM_NAME}> = Object.freeze({
  ${mapLines.join(',\n  ')},
});

// ${ERROR_MESSAGE_MAP_LINES.length} entries
const ERROR_MESSAGE_MAP: Record<string, string> = Object.freeze({
  ${ERROR_MESSAGE_MAP_LINES.join(',\n  ')},
});
`.trim();
};

const ERROR_MESSAGE_MAP_LINES = ERROR_MESSAGES.map(({ key, message }) => `'${key}': '${message}'`);

const createEnum = (enumName: string, values: string[], isPrivate = false) => `// ${values.length} entries
${isPrivate ? '' : 'export '}enum ${enumName} {
  ${values.map((v) => `${v} = '${v}'`).join(',\n  ')},
}`;

const USER_ENUM = createEnum(USER_ENUM_NAME, USER_VALUES);

const CASE_STATUS_ENUM = createEnum(CASE_STATUS_ENUM_NAME, CASE_STATUS_VALUES);

const DOCUMENT_TYPE_ENUM = createEnum(DOCUMENT_TYPE_ENUM_NAME, DOCUMENT_TYPE_VALUES);

const PARENT_ENUM = createEnum(PARENT_ENUM_NAME, PARENT_VALUES);

const CREATOR_ENUM = createEnum(CREATOR_ENUM_NAME, CREATOR_VALUES);

const ACTION_ENUM = createEnum(ACTION_ENUM_NAME, ACTION_VALUES);

const ACCESS_ENUM = createEnum(ACCESS_ENUM_NAME, ACCESS_VALUES, true);

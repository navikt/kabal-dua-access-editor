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

const USER_ENUM_NAME = 'User';
const CASE_STATUS_ENUM_NAME = 'CaseStatus';
const DOCUMENT_TYPE_ENUM_NAME = 'DokumentType';
const PARENT_ENUM_NAME = 'Parent';
const ACTION_ENUM_NAME = 'Action';
const ACCESS_ENUM_NAME = 'Access';
const CREATOR_ENUM_NAME = 'Creator';

export const accessToKotlin = (access: ParsedCsv) => {
  const { rows } = access;

  const mapLines = rows.reduce<string[]>(
    (acc, row) => acc.concat(rowToEntries(row, (key, value) => `"${key}" to ${ACCESS_ENUM_NAME}.${value}`)),
    [],
  );

  return `
class DuaAccessPolicy {
${indent(USER_ENUM, 1)}
  
${indent(CASE_STATUS_ENUM, 1)}
    
${indent(DOCUMENT_TYPE_ENUM, 1)}
    
${indent(PARENT_ENUM, 1)}
    
${indent(CREATOR_ENUM, 1)}
    
${indent(ACTION_ENUM, 1)}
    
${indent(ACCESS_ENUM, 1)}

    companion object {
        fun throwDuaFinishedException() {
            throw ${Exception.RuntimeException}("Ferdigstilt dokument kan ikke endres. Kontakt Team Klage.")
        }
        
        fun validateDuaAccess(
            user: ${USER_ENUM_NAME},
            caseStatus: ${CASE_STATUS_ENUM_NAME},
            documentType: ${DOCUMENT_TYPE_ENUM_NAME},
            parent: ${PARENT_ENUM_NAME},
            creator: ${CREATOR_ENUM_NAME},
            action: ${ACTION_ENUM_NAME},
        ) {
            val key = "$user:$caseStatus:$documentType:$parent:$creator:$action"
            val access = accessMap[key]

            if (access == ${ACCESS_ENUM_NAME}.${Access.ALLOWED}) {
                return
            }

            if (access == null) {
                throw ${Exception.RuntimeException}("Handlingen er ikke mulig. Det finnes ikke regel for \\"$key\\". Kontakt Team Klage.")
            }

            val error = errorMessageMap["$access:$action"]

            if (error == null) {
                throw ${Exception.RuntimeException}("Handlingen er ikke mulig. Feilmelding mangler for \\"$access:$action\\". Kontakt Team Klage.")
            }

            // ${ACCESS_VALUES.length} cases
            when (access) {
${indent(EXCEPTION_CASES.join('\n'), 4)}
            }
        }

        // ${mapLines.length} entries
        private val accessMap = mapOf(
${indent(toLines(mapLines), 3)},
        )
        
        // ${ERROR_MESSAGE_MAP_LINES.length} entries
        private val errorMessageMap = mapOf(
${indent(toLines(ERROR_MESSAGE_MAP_LINES), 3)},
        )
    }
}
`.trim();
};

const ERROR_MESSAGE_MAP_LINES = ERROR_MESSAGES.map(({ key, message }) => `"${key}" to "${message}"`);

enum Exception {
  /** 400 */
  DokumentValidationException = 'DokumentValidationException',
  /** 403 */
  MissingTilgangException = 'MissingTilgangException',
  /** 500 */
  RuntimeException = 'RuntimeException',
}

const ACCESS_TO_EXCEPTION: Record<Access, Exception> = {
  [Access.ALLOWED]: Exception.RuntimeException,
  [Access.NOT_SUPPORTED]: Exception.DokumentValidationException,
  [Access.NOT_ASSIGNED]: Exception.MissingTilgangException,
  [Access.NOT_ASSIGNED_OR_MEDUNDERSKRIVER]: Exception.MissingTilgangException,
  [Access.NOT_ASSIGNED_ROL]: Exception.MissingTilgangException,
  [Access.NOT_ASSIGNED_OR_ROL]: Exception.MissingTilgangException,
  [Access.ROL_REQUIRED]: Exception.MissingTilgangException,
  [Access.SENT_TO_MU]: Exception.MissingTilgangException,
  [Access.SENT_TO_ROL]: Exception.MissingTilgangException,
  [Access.ROL_USER]: Exception.MissingTilgangException,
  [Access.ROL_QUESTIONS]: Exception.DokumentValidationException,
  [Access.OTHERS_ATTACHMENTS]: Exception.MissingTilgangException,
  [Access.UNSET]: Exception.RuntimeException,
};

const EXCEPTION_CASES = ACCESS_VALUES.map(
  (access) => `${ACCESS_ENUM_NAME}.${access} -> throw ${ACCESS_TO_EXCEPTION[access]}(error)`,
);

const TAB_SIZE = 4;
const indent = (value: string, count: number) => value.replace(/^/gm, ' '.repeat(count * TAB_SIZE));
const toLines = (values: string[]) => values.join(',\n');

const createEnum = (enumName: string, values: string[], isPrivate = false) =>
  `// ${values.length} entries
${isPrivate ? 'private ' : ''}enum class ${enumName} {
${indent(toLines(values), 1)},
}`;

const USER_ENUM = createEnum(USER_ENUM_NAME, USER_VALUES);

const CASE_STATUS_ENUM = createEnum(CASE_STATUS_ENUM_NAME, CASE_STATUS_VALUES);

const DOCUMENT_TYPE_ENUM = createEnum(DOCUMENT_TYPE_ENUM_NAME, DOCUMENT_TYPE_VALUES);

const PARENT_ENUM = createEnum(PARENT_ENUM_NAME, PARENT_VALUES);

const CREATOR_ENUM = createEnum(CREATOR_ENUM_NAME, CREATOR_VALUES);

const ACTION_ENUM = createEnum(ACTION_ENUM_NAME, ACTION_VALUES);

const ACCESS_ENUM = createEnum(ACCESS_ENUM_NAME, ACCESS_VALUES, true);

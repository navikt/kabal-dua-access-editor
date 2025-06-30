import type { RowUsecase } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ActionEnum } from '@/lib/enums/actions';
import { CreatorEnum } from '@/lib/enums/creator';
import { DocumentTypeEnum } from '@/lib/enums/document-type';
import { ParentEnum } from '@/lib/enums/parent';
import { UserEnum } from '@/lib/enums/user';

const NOT_SUPPORTED_DOCUMENT_TYPES: Record<ActionEnum, DocumentTypeEnum[]> = {
  [ActionEnum.CREATE]: [],
  [ActionEnum.WRITE]: [DocumentTypeEnum.JOURNALFOERT, DocumentTypeEnum.UPLOADED],
  [ActionEnum.REMOVE]: [],
  [ActionEnum.CHANGE_TYPE]: [
    DocumentTypeEnum.JOURNALFOERT,
    DocumentTypeEnum.ROL_QUESTIONS,
    DocumentTypeEnum.ROL_ANSWERS,
  ],
  [ActionEnum.RENAME]: [DocumentTypeEnum.JOURNALFOERT, DocumentTypeEnum.ROL_ANSWERS],
  [ActionEnum.FINISH]: [DocumentTypeEnum.JOURNALFOERT, DocumentTypeEnum.ROL_ANSWERS],
};

const INVALID_ACTIONS_FOR_ATTACHMENTS: ActionEnum[] = [ActionEnum.CHANGE_TYPE, ActionEnum.FINISH];

const VALID_CREATOR_FOR_USER: Record<UserEnum, CreatorEnum> = {
  [UserEnum.SAKSBEHANDLER]: CreatorEnum.NONE,
  [UserEnum.TILDELT_SAKSBEHANDLER]: CreatorEnum.KABAL_SAKSBEHANDLING,
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: CreatorEnum.KABAL_MEDUNDERSKRIVER,
  [UserEnum.ROL]: CreatorEnum.NONE,
  [UserEnum.TILDELT_ROL]: CreatorEnum.KABAL_ROL,
};

export const getInitialAccess = (action: ActionEnum, { user, documentType, parent, creator }: RowUsecase): Access => {
  if (NOT_SUPPORTED_DOCUMENT_TYPES[action].includes(documentType)) {
    return Access.NOT_SUPPORTED;
  }

  if (parent !== ParentEnum.NONE && INVALID_ACTIONS_FOR_ATTACHMENTS.includes(action)) {
    return Access.NOT_SUPPORTED;
  }

  if (action === ActionEnum.CREATE) {
    const validCreator = VALID_CREATOR_FOR_USER[user];

    if (validCreator !== creator) {
      return Access.NOT_SUPPORTED;
    }
  }

  return Access.UNSET;
};

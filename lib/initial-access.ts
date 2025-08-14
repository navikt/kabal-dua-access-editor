import type { RowUsecase } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ActionEnum } from '@/lib/enums/actions';
import { CreatorEnum } from '@/lib/enums/creator';
import { DocumentTypeEnum } from '@/lib/enums/document-type';
import { ParentEnum } from '@/lib/enums/parent';
import { UserEnum } from '@/lib/enums/user';

const VALID_CREATOR_FOR_USER: Record<UserEnum, CreatorEnum> = {
  [UserEnum.SAKSBEHANDLER]: CreatorEnum.NONE,
  [UserEnum.TILDELT_SAKSBEHANDLER]: CreatorEnum.KABAL_SAKSBEHANDLING,
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: CreatorEnum.KABAL_MEDUNDERSKRIVER,
  [UserEnum.ROL]: CreatorEnum.NONE,
  [UserEnum.TILDELT_ROL]: CreatorEnum.KABAL_ROL,
};

export const getInitialAccess = (action: ActionEnum, { user, documentType, parent, creator }: RowUsecase): Access => {
  // Only the current user can be the creator.
  if (action === ActionEnum.CREATE) {
    const validCreator = VALID_CREATOR_FOR_USER[user];

    if (validCreator !== creator) {
      return Access.NOT_SUPPORTED;
    }
  }

  // Journalførte dokumenter
  if (documentType === DocumentTypeEnum.JOURNALFOERT) {
    if (action === ActionEnum.RENAME) {
      return Access.NOT_SUPPORTED_JOURNALFOERT;
    }

    if (action === ActionEnum.WRITE) {
      return Access.NOT_SUPPORTED_JOURNALFOERT;
    }

    if (action === ActionEnum.CHANGE_TYPE) {
      return Access.NOT_SUPPORTED_JOURNALFOERT;
    }
  }

  // Svar fra ROL
  if (documentType === DocumentTypeEnum.ROL_ANSWERS) {
    if (action === ActionEnum.CHANGE_TYPE) {
      return Access.NOT_SUPPORTED;
    }
  }

  // Spørsmål til ROL
  if (documentType === DocumentTypeEnum.ROL_QUESTIONS) {
    if (action === ActionEnum.CHANGE_TYPE) {
      return Access.NOT_SUPPORTED_ROL_QUESTIONS;
    }
  }

  // Alle vedlegg
  if (parent !== ParentEnum.NONE) {
    if (action === ActionEnum.CHANGE_TYPE || action === ActionEnum.FINISH) {
      return Access.NOT_SUPPORTED_ATTACHMENT;
    }
  }

  // Opplastede dokumenter
  if (documentType === DocumentTypeEnum.UPLOADED) {
    return getUploadedAccess(action, user, parent);
  }

  return Access.UNSET;
};

const getUploadedAccess = (action: ActionEnum, user: UserEnum, parent: ParentEnum): Access => {
  if (user === UserEnum.ROL) {
    return Access.NOT_SUPPORTED;
  }

  if (action === ActionEnum.CREATE) {
    return Access.ALLOWED;
  }

  if (action === ActionEnum.CHANGE_TYPE || action === ActionEnum.FINISH) {
    return parent === ParentEnum.NONE ? Access.ALLOWED : Access.NOT_SUPPORTED;
  }

  if (action === ActionEnum.REMOVE || action === ActionEnum.RENAME) {
    return Access.ALLOWED;
  }

  if (action === ActionEnum.WRITE) {
    return Access.NOT_SUPPORTED;
  }

  return Access.UNSET;
};

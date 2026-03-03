import type { RowUsecase } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ActionEnum } from '@/lib/enums/actions';
import { CaseStatus } from '@/lib/enums/case-status';
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

export const getInitialAccess = (
  action: ActionEnum,
  { user, documentType, parent, creator, caseStatus }: RowUsecase,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This function has a high cognitive complexity due to multiple nested conditions and business rules.
): Access => {
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

  // Smartdokumenter
  if (documentType === DocumentTypeEnum.SMART_DOCUMENT) {
    if (
      (caseStatus === CaseStatus.WITH_SAKSBEHANDLER || caseStatus === CaseStatus.RETURNED_FROM_ROL) &&
      user !== UserEnum.TILDELT_SAKSBEHANDLER
    ) {
      return Access.NOT_ASSIGNED;
    }

    if (
      action === ActionEnum.WRITE &&
      (caseStatus === CaseStatus.WITH_MU ||
        caseStatus === CaseStatus.WITH_MU_AND_ROL ||
        caseStatus === CaseStatus.WITH_MU_AND_RETURNED_FROM_ROL) &&
      user !== UserEnum.TILDELT_MEDUNDERSKRIVER
    ) {
      return Access.SENT_TO_MU;
    }

    if (caseStatus === CaseStatus.WITH_ROL) {
      return user === UserEnum.TILDELT_SAKSBEHANDLER ? Access.ALLOWED : Access.NOT_ASSIGNED;
    }

    if (
      action === ActionEnum.WRITE &&
      caseStatus === CaseStatus.WITH_MU_AND_ROL &&
      user === UserEnum.TILDELT_MEDUNDERSKRIVER
    ) {
      return Access.ALLOWED;
    }
  }

  // Svar fra ROL
  if (documentType === DocumentTypeEnum.ROL_ANSWERS) {
    if (user !== UserEnum.TILDELT_ROL) {
      return Access.NOT_ASSIGNED_ROL;
    }

    if (caseStatus !== CaseStatus.WITH_ROL && caseStatus !== CaseStatus.WITH_MU_AND_ROL) {
      return Access.NOT_ASSIGNED_ROL;
    }

    if (action === ActionEnum.CHANGE_TYPE) {
      return Access.NOT_SUPPORTED;
    }
  }

  // Spørsmål til ROL
  if (documentType === DocumentTypeEnum.ROL_QUESTIONS) {
    if (
      (caseStatus === CaseStatus.WITH_SAKSBEHANDLER || caseStatus === CaseStatus.RETURNED_FROM_ROL) &&
      user !== UserEnum.TILDELT_SAKSBEHANDLER
    ) {
      return Access.NOT_ASSIGNED;
    }

    if (
      action === ActionEnum.WRITE &&
      (caseStatus === CaseStatus.WITH_MU || caseStatus === CaseStatus.WITH_MU_AND_RETURNED_FROM_ROL) &&
      user !== UserEnum.TILDELT_MEDUNDERSKRIVER
    ) {
      return Access.SENT_TO_MU;
    }

    if (caseStatus === CaseStatus.WITH_ROL || caseStatus === CaseStatus.WITH_MU_AND_ROL) {
      return Access.SENT_TO_ROL;
    }

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

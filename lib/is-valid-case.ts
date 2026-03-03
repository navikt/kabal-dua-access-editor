import type { RowUsecase } from '@/lib/data';
import { CaseStatus } from '@/lib/enums/case-status';
import { DocumentTypeEnum } from '@/lib/enums/document-type';
import { ParentEnum } from '@/lib/enums/parent';
import { UserEnum } from '@/lib/enums/user';

const INVALID_CASE_STATUS_FOR_USER: Record<UserEnum, CaseStatus[]> = {
  [UserEnum.SAKSBEHANDLER]: [],
  [UserEnum.TILDELT_SAKSBEHANDLER]: [CaseStatus.LEDIG, CaseStatus.FULLFOERT],
  [UserEnum.TILDELT_MEDUNDERSKRIVER]: [CaseStatus.LEDIG, CaseStatus.FULLFOERT],
  [UserEnum.ROL]: [],
  [UserEnum.TILDELT_ROL]: [CaseStatus.LEDIG, CaseStatus.FULLFOERT],
};

const VALID_ATTACHMENT_DOCUMENT_TYPES: DocumentTypeEnum[] = [
  DocumentTypeEnum.JOURNALFOERT,
  DocumentTypeEnum.UPLOADED,
  DocumentTypeEnum.ROL_ANSWERS,
];

const VALID_MAIN_DOCUMENT_TYPES: DocumentTypeEnum[] = [
  DocumentTypeEnum.SMART_DOCUMENT,
  DocumentTypeEnum.UPLOADED,
  DocumentTypeEnum.ROL_QUESTIONS,
];

export const isValidCase = ({ user, caseStatus, documentType, parent }: RowUsecase): boolean => {
  if (
    user === UserEnum.TILDELT_MEDUNDERSKRIVER &&
    (documentType === DocumentTypeEnum.JOURNALFOERT ||
      documentType === DocumentTypeEnum.UPLOADED ||
      documentType === DocumentTypeEnum.ROL_ANSWERS) &&
    (caseStatus === CaseStatus.WITH_SAKSBEHANDLER ||
      caseStatus === CaseStatus.WITH_ROL ||
      caseStatus === CaseStatus.RETURNED_FROM_ROL)
  ) {
    return false;
  }

  if (
    user === UserEnum.TILDELT_ROL &&
    (documentType === DocumentTypeEnum.JOURNALFOERT ||
      documentType === DocumentTypeEnum.UPLOADED ||
      documentType === DocumentTypeEnum.ROL_QUESTIONS ||
      documentType === DocumentTypeEnum.SMART_DOCUMENT) &&
    (caseStatus === CaseStatus.WITH_SAKSBEHANDLER || caseStatus === CaseStatus.WITH_MU)
  ) {
    return false;
  }

  if (INVALID_CASE_STATUS_FOR_USER[user].includes(caseStatus)) {
    return false;
  }

  if (parent !== ParentEnum.NONE) {
    if (!VALID_ATTACHMENT_DOCUMENT_TYPES.includes(documentType)) {
      return false;
    }

    if (documentType === DocumentTypeEnum.ROL_ANSWERS && parent !== ParentEnum.ROL_QUESTIONS) {
      return false;
    }

    if (documentType === DocumentTypeEnum.UPLOADED && parent !== ParentEnum.UPLOADED) {
      return false;
    }

    if (documentType === DocumentTypeEnum.SMART_DOCUMENT) {
      return false;
    }
  }

  if (parent === ParentEnum.NONE && !VALID_MAIN_DOCUMENT_TYPES.includes(documentType)) {
    return false;
  }

  return true;
};

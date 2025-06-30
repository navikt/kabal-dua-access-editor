import type { TagProps } from '@navikt/ds-react';

export enum DocumentTypeEnum {
  /** Smartdokument/-vedlegg */
  SMART_DOCUMENT = 'SMART_DOCUMENT',
  /** Opplastet dokument/vedlegg. */
  UPLOADED = 'UPLOADED',
  /** Journalført vedlegg. */
  JOURNALFOERT = 'JOURNALFOERT',
  /** Spørsmål til ROL. */
  ROL_QUESTIONS = 'ROL_QUESTIONS',
  /** Svar fra ROL. */
  ROL_ANSWERS = 'ROL_ANSWERS',
}

export const DOCUMENT_TYPE_VALUES = Object.values(DocumentTypeEnum);

export const isDocumentType = (value: string | undefined): value is DocumentTypeEnum =>
  value !== undefined && DOCUMENT_TYPE_VALUES.includes(value as DocumentTypeEnum);

export const DOCUMENT_TYPE_NAMES: Record<DocumentTypeEnum, string> = {
  [DocumentTypeEnum.SMART_DOCUMENT]: 'Smart',
  [DocumentTypeEnum.UPLOADED]: 'Opplastet',
  [DocumentTypeEnum.JOURNALFOERT]: 'Journalført',
  [DocumentTypeEnum.ROL_QUESTIONS]: 'Spørsmål til ROL',
  [DocumentTypeEnum.ROL_ANSWERS]: 'Svar fra ROL',
};

export const DOCUMENT_TYPE_COLORS: Record<DocumentTypeEnum, TagProps['variant']> = {
  [DocumentTypeEnum.SMART_DOCUMENT]: 'info-moderate',
  [DocumentTypeEnum.UPLOADED]: 'success-moderate',
  [DocumentTypeEnum.JOURNALFOERT]: 'neutral-moderate',
  [DocumentTypeEnum.ROL_QUESTIONS]: 'alt1-moderate',
  [DocumentTypeEnum.ROL_ANSWERS]: 'alt1',
};

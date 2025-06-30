/** biome-ignore-all lint/style/useLiteralEnumMembers: Enums */
import type { TagProps } from '@navikt/ds-react';
import { DOCUMENT_TYPE_COLORS, DOCUMENT_TYPE_NAMES, DocumentTypeEnum } from '@/lib/enums/document-type';

export enum ParentEnum {
  /** Parent document. */
  NONE = 'NONE',
  /** Smartdokument/-vedlegg */
  SMART_DOCUMENT = DocumentTypeEnum.SMART_DOCUMENT,
  /** Opplastet dokument/vedlegg. */
  UPLOADED = DocumentTypeEnum.UPLOADED,
  /** Spørsmål til ROL. */
  ROL_QUESTIONS = DocumentTypeEnum.ROL_QUESTIONS,
}

export const PARENT_VALUES = Object.values(ParentEnum);

export const isParent = (value: string | undefined): value is ParentEnum =>
  value !== undefined && PARENT_VALUES.includes(value as ParentEnum);

export const PARENT_NAMES: Record<ParentEnum, string | null> = {
  [ParentEnum.NONE]: null,
  [ParentEnum.SMART_DOCUMENT]: DOCUMENT_TYPE_NAMES[DocumentTypeEnum.SMART_DOCUMENT],
  [ParentEnum.UPLOADED]: DOCUMENT_TYPE_NAMES[DocumentTypeEnum.UPLOADED],
  [ParentEnum.ROL_QUESTIONS]: DOCUMENT_TYPE_NAMES[DocumentTypeEnum.ROL_QUESTIONS],
};

export const PARENT_COLORS: Record<ParentEnum, TagProps['variant']> = {
  [ParentEnum.NONE]: 'neutral-moderate',
  [ParentEnum.SMART_DOCUMENT]: DOCUMENT_TYPE_COLORS[DocumentTypeEnum.SMART_DOCUMENT],
  [ParentEnum.UPLOADED]: DOCUMENT_TYPE_COLORS[DocumentTypeEnum.UPLOADED],
  [ParentEnum.ROL_QUESTIONS]: DOCUMENT_TYPE_COLORS[DocumentTypeEnum.ROL_QUESTIONS],
};

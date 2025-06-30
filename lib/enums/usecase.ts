export enum UsecaseDimension {
  USER = 'USER',
  CASE_STATUS = 'CASE_STATUS',
  DOCUMENT_TYPE = 'DOCUMENT_TYPE',
  PARENT = 'PARENT',
  CREATOR = 'CREATOR',
}

export const USECASE_DIMENSION_VALUES = Object.values(UsecaseDimension);

export const isUsecaseDimension = (value: string): value is UsecaseDimension =>
  USECASE_DIMENSION_VALUES.includes(value as UsecaseDimension);

export const USECASE_DIMENSION_NAMES: Record<UsecaseDimension, string> = {
  [UsecaseDimension.USER]: 'Bruker er ...',
  [UsecaseDimension.CASE_STATUS]: 'Saken er ...',
  [UsecaseDimension.DOCUMENT_TYPE]: 'Dokumentet er ...',
  [UsecaseDimension.PARENT]: 'Vedlegg til ...',
  [UsecaseDimension.CREATOR]: 'Opprettet av ...',
};

export enum UsecaseProperty {
  USER = 'user',
  CASE_STATUS = 'caseStatus',
  DOCUMENT_TYPE = 'documentType',
  PARENT = 'parent',
  CREATOR = 'creator',
}

export const USECASE_PROPERTY_VALUES = Object.values(UsecaseProperty);

export const isUsecaseProperty = (value: string): value is UsecaseProperty =>
  USECASE_PROPERTY_VALUES.includes(value as UsecaseProperty);

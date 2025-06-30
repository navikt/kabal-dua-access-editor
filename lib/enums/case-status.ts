import type { TagProps } from '@navikt/ds-react';

export enum CaseStatus {
  LEDIG = 'LEDIG',
  WITH_SAKSBEHANDLER = 'WITH_SAKSBEHANDLER',
  WITH_MU = 'WITH_MU',
  WITH_ROL = 'WITH_ROL',
  RETURNED_FROM_ROL = 'RETURNED_FROM_ROL',
  FULLFOERT = 'FULLFOERT',
}

export const CASE_STATUS_VALUES = Object.values(CaseStatus);

export const isCaseStatus = (value: string | undefined): value is CaseStatus =>
  value !== undefined && CASE_STATUS_VALUES.includes(value as CaseStatus);

export const CASE_STATUS_NAMES: Record<CaseStatus, string> = {
  [CaseStatus.LEDIG]: 'Ledig',
  [CaseStatus.WITH_SAKSBEHANDLER]: 'Hos saksbehandler',
  [CaseStatus.WITH_MU]: 'Hos MU',
  [CaseStatus.WITH_ROL]: 'Hos ROL',
  [CaseStatus.RETURNED_FROM_ROL]: 'Returnert fra ROL',
  [CaseStatus.FULLFOERT]: 'Ferdig',
};

export const CASE_STATUS_COLORS: Record<CaseStatus, TagProps['variant']> = {
  [CaseStatus.LEDIG]: 'neutral',
  [CaseStatus.WITH_SAKSBEHANDLER]: 'info-moderate',
  [CaseStatus.WITH_MU]: 'warning-moderate',
  [CaseStatus.WITH_ROL]: 'alt1-moderate',
  [CaseStatus.RETURNED_FROM_ROL]: 'info-filled',
  [CaseStatus.FULLFOERT]: 'alt3-moderate',
};

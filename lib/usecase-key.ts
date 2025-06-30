import type { RowUsecase } from '@/lib/data';

export const usecaseToKey = ({ user, caseStatus, documentType, parent, creator }: RowUsecase) =>
  `${user}-${caseStatus}-${documentType}-${parent}-${creator}`;

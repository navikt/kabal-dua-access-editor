import type { RowUsecase } from '@/lib/data';

export const matchUsecase = (a: RowUsecase, b: RowUsecase): boolean =>
  Object.entries(a).every(([key, value]) => isKey(key, b) && b[key] === value);

const isKey = (key: string, usecase: RowUsecase): key is keyof RowUsecase => key in usecase;

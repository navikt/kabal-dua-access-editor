import type { ParsedCsv, ParsedRow, RowUsecase } from '@/lib/data';
import { ACTION_VALUES, ActionEnum } from '@/lib/enums/actions';
import { ALL_USECASES } from '@/lib/enums/all';
import { USECASE_DIMENSION_VALUES } from '@/lib/enums/usecase';
import { getInitialAccess } from '@/lib/initial-access';

const headers = [...USECASE_DIMENSION_VALUES, ...ACTION_VALUES];

const createRow = (usecase: RowUsecase): ParsedRow => ({
  usecase,
  actions: {
    CREATE: getInitialAccess(ActionEnum.CREATE, usecase),
    WRITE: getInitialAccess(ActionEnum.WRITE, usecase),
    REMOVE: getInitialAccess(ActionEnum.REMOVE, usecase),
    CHANGE_TYPE: getInitialAccess(ActionEnum.CHANGE_TYPE, usecase),
    RENAME: getInitialAccess(ActionEnum.RENAME, usecase),
    FINISH: getInitialAccess(ActionEnum.FINISH, usecase),
  },
});

export const INITIAL_CSV: ParsedCsv = { headers, rows: ALL_USECASES.map(createRow) };

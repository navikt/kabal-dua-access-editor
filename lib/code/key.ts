import type { RowUsecase } from '@/lib/data';
import type { ActionEnum } from '@/lib/enums/actions';
import { USECASE_PROPERTY_VALUES } from '@/lib/enums/usecase';

export const key = (usecase: RowUsecase, action: ActionEnum): string =>
  `${USECASE_PROPERTY_VALUES.map((d) => usecase[d]).join(':')}:${action}`;

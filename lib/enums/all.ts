import type { RowUsecase } from '@/lib/data';
import { ACTION_VALUES } from '@/lib/enums/actions';
import { CASE_STATUS_VALUES } from '@/lib/enums/case-status';
import { CREATOR_VALUES } from '@/lib/enums/creator';
import { DOCUMENT_TYPE_VALUES } from '@/lib/enums/document-type';
import { PARENT_VALUES } from '@/lib/enums/parent';
import { USER_VALUES } from '@/lib/enums/user';
import { isValidCase } from '@/lib/is-valid-case';
import { usecaseToKey } from '@/lib/usecase-key';

export const ALL_USECASES: RowUsecase[] = [];

export const ALL_IDS: string[] = [];

for (const user of USER_VALUES) {
  for (const caseStatus of CASE_STATUS_VALUES) {
    for (const documentType of DOCUMENT_TYPE_VALUES) {
      for (const parent of PARENT_VALUES) {
        for (const creator of CREATOR_VALUES) {
          const usecase: RowUsecase = { user, caseStatus, documentType, parent, creator };

          if (isValidCase(usecase)) {
            ALL_USECASES.push(usecase);

            for (const action of ACTION_VALUES) {
              ALL_IDS.push(`${usecaseToKey(usecase)}-${action}`);
            }
          }
        }
      }
    }
  }
}

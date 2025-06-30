import { readCsv } from '@/lib/csv/read';
import { writeCsv } from '@/lib/csv/write';
import type { ParsedCsv, ParsedRow } from '@/lib/data';
import type { Access } from '@/lib/enums/access';
import type { ActionEnum } from '@/lib/enums/actions';
import type { CaseStatus } from '@/lib/enums/case-status';
import type { CreatorEnum } from '@/lib/enums/creator';
import type { DocumentTypeEnum } from '@/lib/enums/document-type';
import type { ParentEnum } from '@/lib/enums/parent';
import type { UserEnum } from '@/lib/enums/user';
import { matchUsecase } from '@/lib/usecase';

export const setActionAccess = async (
  user: UserEnum,
  caseStatus: CaseStatus,
  documentType: DocumentTypeEnum,
  parent: ParentEnum,
  creator: CreatorEnum,
  action: ActionEnum,
  access: Access,
): Promise<ParsedCsv> => {
  const parsedCsv = await readCsv();
  const { headers, rows } = parsedCsv;

  const updatedRows = rows.map<ParsedRow>((row) => {
    const { usecase, actions } = row;

    if (!matchUsecase(usecase, { user, caseStatus, documentType, parent, creator })) {
      return row;
    }

    return { usecase, actions: { ...actions, [action]: access } };
  });

  return writeCsv({ headers, rows: updatedRows });
};

import type { Access } from '@/lib/enums/access';
import type { ActionEnum } from '@/lib/enums/actions';
import type { CaseStatus } from '@/lib/enums/case-status';
import type { CreatorEnum } from '@/lib/enums/creator';
import type { DocumentTypeEnum } from '@/lib/enums/document-type';
import type { ParentEnum } from '@/lib/enums/parent';
import { UsecaseProperty } from '@/lib/enums/usecase';
import type { UserEnum } from '@/lib/enums/user';

export type RowUsecase = {
  readonly [UsecaseProperty.USER]: UserEnum;
  readonly [UsecaseProperty.CASE_STATUS]: CaseStatus;
  readonly [UsecaseProperty.DOCUMENT_TYPE]: DocumentTypeEnum;
  readonly [UsecaseProperty.PARENT]: ParentEnum;
  readonly [UsecaseProperty.CREATOR]: CreatorEnum;
};

export type RowActions = Readonly<Record<ActionEnum, Access>>;

export interface ParsedRow {
  readonly usecase: RowUsecase;
  readonly actions: RowActions;
}

export interface ParsedCsv {
  readonly headers: string[];
  readonly rows: ParsedRow[];
}

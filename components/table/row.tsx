import { CheckmarkIcon } from '@navikt/aksel-icons';
import { TableDataCell, TableRow } from '@navikt/ds-react/Table';
import { useMemo } from 'react';
import { AccessCell } from '@/components/table/access';
import { UsecaseCell } from '@/components/table/usecase';
import type { ParsedRow, RowUsecase } from '@/lib/data';
import { ACTION_VALUES } from '@/lib/enums/actions';
import { CASE_STATUS_COLORS, CASE_STATUS_NAMES } from '@/lib/enums/case-status';
import { CREATOR_COLORS, CREATOR_DOCUMENT_NAMES } from '@/lib/enums/creator';
import { DOCUMENT_TYPE_COLORS, DOCUMENT_TYPE_NAMES } from '@/lib/enums/document-type';
import { PARENT_COLORS, PARENT_NAMES } from '@/lib/enums/parent';
import { USER_COLORS, USER_NAMES } from '@/lib/enums/user';
import { getIsRowDone } from '@/lib/row-remaining';
import { matchUsecase } from '@/lib/usecase';

interface RowProps {
  rowKey: string;
  rows: ParsedRow[];
  usecase: RowUsecase;
  rowNumber: number;
}

export const Row = ({ rowKey, rows, usecase, rowNumber }: RowProps) => {
  const { user, caseStatus, documentType, parent, creator } = usecase;

  const row = useMemo(() => rows.find((row) => matchUsecase(row.usecase, usecase)), [rows.find, usecase]);

  return (
    <TableRow>
      <TableDataCell>
        {getIsRowDone(row) ? <CheckmarkIcon aria-hidden className="text-ax-text-success" /> : null}
      </TableDataCell>
      <TableDataCell>{rowNumber}</TableDataCell>
      <UsecaseCell variant={USER_COLORS[user]}>{USER_NAMES[user]}</UsecaseCell>
      <UsecaseCell variant={CASE_STATUS_COLORS[caseStatus]}>{CASE_STATUS_NAMES[caseStatus]}</UsecaseCell>
      <UsecaseCell variant={DOCUMENT_TYPE_COLORS[documentType]}>{DOCUMENT_TYPE_NAMES[documentType]}</UsecaseCell>
      <UsecaseCell variant={PARENT_COLORS[parent]}>{PARENT_NAMES[parent]}</UsecaseCell>
      <UsecaseCell variant={CREATOR_COLORS[creator]}>{CREATOR_DOCUMENT_NAMES[creator]}</UsecaseCell>

      {ACTION_VALUES.map((action) => {
        const id = `${rowKey}-${action}`;

        return <AccessCell key={id} id={id} usecase={usecase} action={action} row={row} />;
      })}
    </TableRow>
  );
};

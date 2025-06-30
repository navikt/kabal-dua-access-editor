import type { ParsedRow } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ACTION_VALUES } from '@/lib/enums/actions';
import { getInitialAccess } from '@/lib/initial-access';

export const getRowsRemaining = (rows: ParsedRow[]) => rows.reduce((acc, row) => acc + getRowRemaining(row), 0);
export const getRowsDone = (rows: ParsedRow[], total = getRowsTotal(rows)) => total - getRowsRemaining(rows);
export const getRowsTotal = (rows: ParsedRow[]) => rows.reduce((acc, row) => acc + availableActions(row).length, 0);

const availableActions = ({ usecase }: ParsedRow) =>
  ACTION_VALUES.filter((action) => getInitialAccess(action, usecase) !== Access.NOT_SUPPORTED);

export const getRowRemaining = (row: ParsedRow) =>
  ACTION_VALUES.filter((action) => row.actions[action] === Access.UNSET).length;

export const getIsRowDone = (row: ParsedRow | undefined) => row !== undefined && getRowRemaining(row) === 0;

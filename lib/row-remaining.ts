import type { ParsedRow } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ACTION_VALUES } from '@/lib/enums/actions';

export const getRowsRemaining = (rows: ParsedRow[]) => rows.reduce((acc, row) => acc + getRowRemaining(row), 0);
export const getRowsDone = (rows: ParsedRow[], total = getRowsTotal(rows)) => total - getRowsRemaining(rows);
export const getRowsTotal = (rows: ParsedRow[]) => rows.length * ACTION_VALUES.length;

export const getRowRemaining = (row: ParsedRow) =>
  ACTION_VALUES.filter((action) => row.actions[action] === Access.UNSET).length;

export const getIsRowDone = (row: ParsedRow | undefined) => row !== undefined && getRowRemaining(row) === 0;

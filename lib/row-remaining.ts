import type { ParsedRow } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ACTION_VALUES } from '@/lib/enums/actions';

const getRowsRemaining = (rows: ParsedRow[]) => rows.reduce((acc, row) => acc + getRowRemaining(row), 0);
export const useRowsDone = (rows: ParsedRow[], total = useRowsTotal(rows)) => total - getRowsRemaining(rows);
export const useRowsTotal = (rows: ParsedRow[]) => rows.length * ACTION_VALUES.length;

const getRowRemaining = (row: ParsedRow) =>
  ACTION_VALUES.filter((action) => row.actions[action] === Access.UNSET).length;

export const useIsRowDone = (row: ParsedRow | undefined) => row !== undefined && getRowRemaining(row) === 0;

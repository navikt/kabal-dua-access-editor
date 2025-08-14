import { writeFile } from 'node:fs/promises';
import { CSV_PATH } from '@/lib/csv/constants';
import { INITIAL_CSV } from '@/lib/csv/initial';
import { readCsv } from '@/lib/csv/read';
import type { ParsedCsv, ParsedRow, RowActions } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ACTION_VALUES, ActionEnum } from '@/lib/enums/actions';
import { USECASE_PROPERTY_VALUES } from '@/lib/enums/usecase';
import { matchUsecase } from '@/lib/usecase';

export const writeCsv = async (data: ParsedCsv): Promise<ParsedCsv> => {
  const rows = data.rows.map((row) => {
    const usecaseValues = USECASE_PROPERTY_VALUES.map((header) => row.usecase[header]);
    const actionValues = ACTION_VALUES.map((header) => row.actions[header]);

    return [...usecaseValues, ...actionValues];
  });

  const csvContent = [INITIAL_CSV.headers, ...rows].map((row) => row.join(',')).join('\n');

  await writeFile(CSV_PATH, csvContent, 'utf-8');

  return data;
};

export const createInitialCsv = async (): Promise<ParsedCsv> => writeCsv(INITIAL_CSV);

export const mergeInitialWithExistingCsv = async (): Promise<ParsedCsv> => {
  const existing = await readCsv();

  const rows = INITIAL_CSV.rows.map<ParsedRow>((initialRow) => {
    const existingRow = existing.rows.find((row) => matchUsecase(row.usecase, initialRow.usecase));

    if (existingRow === undefined) {
      return initialRow;
    }

    const getAccess = prepareGetAccess(existingRow.actions, initialRow.actions);

    return {
      usecase: { ...initialRow.usecase, ...existingRow.usecase },
      actions: {
        CREATE: getAccess(ActionEnum.CREATE),
        WRITE: getAccess(ActionEnum.WRITE),
        REMOVE: getAccess(ActionEnum.REMOVE),
        CHANGE_TYPE: getAccess(ActionEnum.CHANGE_TYPE),
        RENAME: getAccess(ActionEnum.RENAME),
        FINISH: getAccess(ActionEnum.FINISH),
      },
    };
  });

  return writeCsv({ headers: INITIAL_CSV.headers, rows });
};

const prepareGetAccess =
  (existing: RowActions, initial: RowActions) =>
  (action: ActionEnum): Access =>
    existing[action] === Access.UNSET ? initial[action] : existing[action];

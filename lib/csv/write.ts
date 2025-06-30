import { writeFile } from 'node:fs/promises';
import { CSV_PATH } from '@/lib/csv/constants';
import { INITIAL_CSV } from '@/lib/csv/initial';
import type { ParsedCsv } from '@/lib/data';
import { ACTION_VALUES } from '@/lib/enums/actions';
import { USECASE_PROPERTY_VALUES } from '@/lib/enums/usecase';

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

import { createHash } from 'node:crypto';
import { rowToEntries } from '@/lib/code/entries';
import type { ParsedRow } from '@/lib/data';

interface Result {
  csv: string;
  entries: number;
  hash: string;
}

export const accessToCsv = (rows: ParsedRow[]): Result => {
  const csvLines = rows.reduce<string[]>(
    (acc, row) => acc.concat(rowToEntries(row, (key, value) => `${key},${value}`)),
    [],
  );

  const csv = csvLines.join('\n').trim();

  return { csv, entries: csvLines.length, hash: createHash('sha256').update(csv).digest('hex') };
};

import { rowToEntries } from '@/lib/code/entries';
import type { ParsedCsv } from '@/lib/data';

export const accessToCsv = (access: ParsedCsv) => {
  const { rows } = access;

  const mapLines = rows.reduce<string[]>(
    (acc, row) => acc.concat(rowToEntries(row, (key, value) => `${key},${value}`)),
    [],
  );

  return mapLines.join('\n').trim();
};

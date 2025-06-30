import { key } from '@/lib/code/key';
import type { ParsedRow } from '@/lib/data';
import { Access } from '@/lib/enums/access';
import { ACTION_VALUES } from '@/lib/enums/actions';

type ToStringFunction = (key: string, value: Access) => string;

export const rowToEntries = ({ usecase, actions }: ParsedRow, toEntry: ToStringFunction) => {
  const entries: string[] = [];

  // Filter out actions that are not supported to minimize the map size.
  for (const action of ACTION_VALUES) {
    const access = actions[action];

    if (access === Access.NOT_SUPPORTED) {
      continue;
    }

    // entries.push(`"${key(usecase, action)}"${separator}${prefix}${access}`);
    entries.push(toEntry(key(usecase, action), access));
  }

  return entries;
};

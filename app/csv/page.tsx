import { BoxNew, Theme } from '@navikt/ds-react';
import type { Metadata } from 'next/types';
import { CopyButton } from '@/components/copy-button';
import { ThemeEnum } from '@/components/theme/common';
import { accessToCsv } from '@/lib/code/csv';
import { readCsv } from '@/lib/csv/read';

export const metadata: Metadata = {
  title: 'CSV',
};

export default async function Csv() {
  const { rows } = await readCsv();

  const { csv, entries, hash } = accessToCsv(rows);

  return (
    <Theme theme={ThemeEnum.DARK}>
      <BoxNew position="relative" background="default" padding="8" width="fit-content" minWidth="100%">
        <CopyButton className="fixed top-8 right-8" text={csv}>
          Kopier CSV
        </CopyButton>

        <pre>{`# Hash: ${hash}\n# Entries: ${entries}\n${csv}`}</pre>
      </BoxNew>
    </Theme>
  );
}

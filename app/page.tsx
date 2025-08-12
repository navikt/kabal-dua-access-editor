'use server';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Table } from '@navikt/ds-react';
import { TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table';
import type { Metadata } from 'next/types';
import { RemainingBadge } from '@/components/remaining-badge';
import { Body } from '@/components/table/body';
import { ServerTheme } from '@/components/theme/server-theme';
import { mergeInitialWithExistingCsv } from '@/lib/csv/write';
import { ACTION_NAMES, ACTION_VALUES } from '@/lib/enums/actions';
import { USECASE_DIMENSION_NAMES, USECASE_DIMENSION_VALUES } from '@/lib/enums/usecase';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Kabal DUA Access Editor',
});

export default async function IndexPage() {
  const { rows } = await mergeInitialWithExistingCsv();

  return (
    <ServerTheme>
      <BoxNew paddingInline="4" className="pb-128">
        <RemainingBadge rows={rows} />

        <Table zebraStripes size="small" stickyHeader>
          <TableHeader>
            <TableRow>
              <TableHeaderCell className="whitespace-nowrap">
                <CheckmarkIcon aria-hidden />
              </TableHeaderCell>

              <TableHeaderCell className="whitespace-nowrap">#</TableHeaderCell>

              {USECASE_DIMENSION_VALUES.map((dimension) => (
                <TableHeaderCell key={dimension} className="whitespace-nowrap">
                  {USECASE_DIMENSION_NAMES[dimension]}
                </TableHeaderCell>
              ))}

              {ACTION_VALUES.map((action) => (
                <TableHeaderCell key={action} className="whitespace-nowrap text-center">
                  {ACTION_NAMES[action]}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>

          <Body rows={rows} />
        </Table>
      </BoxNew>
    </ServerTheme>
  );
}

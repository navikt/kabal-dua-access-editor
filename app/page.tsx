'use server';

import { CheckmarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Table } from '@navikt/ds-react';
import { TableHeader, TableHeaderCell, TableRow } from '@navikt/ds-react/Table';
import type { Metadata } from 'next/types';
import { RemainingBadge } from '@/components/remaining-badge';
import { Body } from '@/components/table/body';
import { FilterHeader } from '@/components/table/header';
import { ServerTheme } from '@/components/theme/server-theme';
import { mergeInitialWithExistingCsv } from '@/lib/csv/write';
import { ACTION_NAMES, ACTION_VALUES } from '@/lib/enums/actions';
import { type CaseStatus, isCaseStatus } from '@/lib/enums/case-status';
import { type CreatorEnum, isCreator } from '@/lib/enums/creator';
import { type DocumentTypeEnum, isDocumentType } from '@/lib/enums/document-type';
import { isParent, type ParentEnum } from '@/lib/enums/parent';
import { USECASE_DIMENSION_VALUES } from '@/lib/enums/usecase';
import { isUser, type UserEnum } from '@/lib/enums/user';

export const generateMetadata = async (): Promise<Metadata> => ({
  title: 'Kabal DUA Access Editor',
});

type SearchParams = Promise<{ [key: string]: string | undefined }>;

interface IndexPageProps {
  searchParams: SearchParams;
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const { rows } = await mergeInitialWithExistingCsv();
  const userFilter = await getQueryParam(searchParams, 'user', isUser);
  const caseStatusFilter = await getQueryParam(searchParams, 'caseStatus', isCaseStatus);
  const documentTypeFilter = await getQueryParam(searchParams, 'documentType', isDocumentType);
  const parentFilter = await getQueryParam(searchParams, 'parent', isParent);
  const creatorFilter = await getQueryParam(searchParams, 'creator', isCreator);

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
                <FilterHeader
                  key={dimension}
                  dimension={dimension}
                  userFilter={userFilter}
                  caseStatusFilter={caseStatusFilter}
                  documentTypeFilter={documentTypeFilter}
                  parentFilter={parentFilter}
                  creatorFilter={creatorFilter}
                />
              ))}

              {ACTION_VALUES.map((action) => (
                <TableHeaderCell key={action} className="whitespace-nowrap text-center">
                  {ACTION_NAMES[action]}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>

          <Body
            rows={rows}
            userServerFilter={userFilter}
            caseStatusServerFilter={caseStatusFilter}
            documentTypeServerFilter={documentTypeFilter}
            parentServerFilter={parentFilter}
            creatorServerFilter={creatorFilter}
          />
        </Table>
      </BoxNew>
    </ServerTheme>
  );
}

type Guard<T extends UserEnum | CaseStatus | DocumentTypeEnum | ParentEnum | CreatorEnum> = (
  value: string,
) => value is T;

const getQueryParam = async <T extends UserEnum | CaseStatus | DocumentTypeEnum | ParentEnum | CreatorEnum>(
  searchParams: SearchParams,
  key: string,
  guard: Guard<T>,
): Promise<T[]> => {
  const params = await searchParams;

  return params[key]?.split(',').filter(guard) ?? [];
};

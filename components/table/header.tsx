'use client';

import { BoxNew, Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { TableHeaderCell } from '@navikt/ds-react/Table';
import { useRef, useState } from 'react';
import {
  useCaseStatusFilter,
  useCreatorFilter,
  useDocumentTypeFilter,
  useParentFilter,
  useSetCaseStatusFilter,
  useSetCreatorFilter,
  useSetDocumentTypeFilter,
  useSetParentFilter,
  useSetUserFilter,
  useUserFilter,
} from '@/components/table/filters';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { CASE_STATUS_NAMES, CASE_STATUS_VALUES, type CaseStatus } from '@/lib/enums/case-status';
import { CREATOR_NAMES, CREATOR_VALUES, type CreatorEnum } from '@/lib/enums/creator';
import { DOCUMENT_TYPE_NAMES, DOCUMENT_TYPE_VALUES, type DocumentTypeEnum } from '@/lib/enums/document-type';
import { PARENT_NAMES, PARENT_VALUES, type ParentEnum } from '@/lib/enums/parent';
import { USECASE_DIMENSION_NAMES, UsecaseDimension } from '@/lib/enums/usecase';
import { USER_NAMES, USER_VALUES, type UserEnum } from '@/lib/enums/user';

interface FilterHeaderProps {
  dimension: UsecaseDimension;
  userFilter: UserEnum[];
  caseStatusFilter: CaseStatus[];
  documentTypeFilter: DocumentTypeEnum[];
  parentFilter: ParentEnum[];
  creatorFilter: CreatorEnum[];
}

export const FilterHeader = ({
  dimension,
  userFilter,
  caseStatusFilter,
  documentTypeFilter,
  parentFilter,
  creatorFilter,
}: FilterHeaderProps) => {
  switch (dimension) {
    case UsecaseDimension.USER:
      return <UserHeader key={dimension} filter={userFilter} />;
    case UsecaseDimension.CASE_STATUS:
      return <CaseStatusHeader key={dimension} filter={caseStatusFilter} />;
    case UsecaseDimension.DOCUMENT_TYPE:
      return <DocumentTypeHeader key={dimension} filter={documentTypeFilter} />;
    case UsecaseDimension.PARENT:
      return <ParentHeader key={dimension} filter={parentFilter} />;
    case UsecaseDimension.CREATOR:
      return <CreatorHeader key={dimension} filter={creatorFilter} />;
  }
};

interface UserHeaderProps {
  filter: UserEnum[];
}

const UserHeader = ({ filter }: UserHeaderProps) => {
  const usersFilter = useUserFilter(filter);
  const setUserFilter = useSetUserFilter();

  return (
    <DropdownHeader label={USECASE_DIMENSION_NAMES.USER} count={usersFilter.length}>
      <CheckboxGroup
        size="small"
        legend={USECASE_DIMENSION_NAMES.USER}
        hideLegend
        value={usersFilter as string[]}
        onChange={setUserFilter}
      >
        {USER_VALUES.map((user) => (
          <Checkbox key={user} value={user} className="w-full">
            {USER_NAMES[user]}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </DropdownHeader>
  );
};

interface CaseStatusHeaderProps {
  filter: CaseStatus[];
}

const CaseStatusHeader = ({ filter }: CaseStatusHeaderProps) => {
  const caseStatusFilter = useCaseStatusFilter(filter);
  const setCaseStatusFilter = useSetCaseStatusFilter();

  return (
    <DropdownHeader label={USECASE_DIMENSION_NAMES.CASE_STATUS} count={caseStatusFilter.length}>
      <CheckboxGroup
        size="small"
        legend={USECASE_DIMENSION_NAMES.CASE_STATUS}
        hideLegend
        value={caseStatusFilter as string[]}
        onChange={setCaseStatusFilter}
      >
        {CASE_STATUS_VALUES.map((status) => (
          <Checkbox key={status} value={status} className="w-full">
            {CASE_STATUS_NAMES[status]}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </DropdownHeader>
  );
};

interface DocumentTypeHeaderProps {
  filter: DocumentTypeEnum[];
}

const DocumentTypeHeader = ({ filter }: DocumentTypeHeaderProps) => {
  const documentTypeFilter = useDocumentTypeFilter(filter);
  const setDocumentTypeFilter = useSetDocumentTypeFilter();

  return (
    <DropdownHeader label={USECASE_DIMENSION_NAMES.DOCUMENT_TYPE} count={documentTypeFilter.length}>
      <CheckboxGroup
        size="small"
        legend={USECASE_DIMENSION_NAMES.DOCUMENT_TYPE}
        hideLegend
        value={documentTypeFilter as string[]}
        onChange={setDocumentTypeFilter}
      >
        {DOCUMENT_TYPE_VALUES.map((type) => (
          <Checkbox key={type} value={type} className="w-full">
            {DOCUMENT_TYPE_NAMES[type]}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </DropdownHeader>
  );
};

interface ParentHeaderProps {
  filter: ParentEnum[];
}

const ParentHeader = ({ filter }: ParentHeaderProps) => {
  const parentFilter = useParentFilter(filter);
  const setParentFilter = useSetParentFilter();

  return (
    <DropdownHeader label={USECASE_DIMENSION_NAMES.PARENT} count={parentFilter.length}>
      <CheckboxGroup
        size="small"
        legend={USECASE_DIMENSION_NAMES.PARENT}
        hideLegend
        value={parentFilter as string[]}
        onChange={setParentFilter}
      >
        {PARENT_VALUES.map((parent) => (
          <Checkbox key={parent} value={parent} className="w-full">
            {PARENT_NAMES[parent] ?? 'Ingen/hoveddokument'}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </DropdownHeader>
  );
};

interface CreatorHeaderProps {
  filter: CreatorEnum[];
}

const CreatorHeader = ({ filter }: CreatorHeaderProps) => {
  const creatorFilter = useCreatorFilter(filter);
  const setCreatorFilter = useSetCreatorFilter();

  return (
    <DropdownHeader label={USECASE_DIMENSION_NAMES.CREATOR} count={creatorFilter.length}>
      <CheckboxGroup
        size="small"
        legend={USECASE_DIMENSION_NAMES.CREATOR}
        hideLegend
        value={creatorFilter as string[]}
        onChange={setCreatorFilter}
      >
        {CREATOR_VALUES.map((creator) => (
          <Checkbox key={creator} value={creator} className="w-full">
            {CREATOR_NAMES[creator]}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </DropdownHeader>
  );
};

interface DropdownHeaderProps {
  label: string;
  children: React.ReactNode;
  count: number;
}

const DropdownHeader = ({ label, children, count }: DropdownHeaderProps) => {
  const ref = useRef<HTMLTableCellElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <TableHeaderCell className="whitespace-nowrap relative" ref={ref}>
      <Button
        variant={count !== 0 ? 'primary-neutral' : 'tertiary-neutral'}
        size="small"
        className="w-full justify-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label} ({count})
      </Button>
      {isOpen ? (
        <BoxNew
          position="absolute"
          background="default"
          shadow="dialog"
          borderRadius="medium"
          left="0"
          paddingInline="2"
          className="top-full"
        >
          {children}
        </BoxNew>
      ) : null}
    </TableHeaderCell>
  );
};

'use client';

import { TableBody } from '@navikt/ds-react/Table';
import { useEffect } from 'react';
import {
  useCaseStatusFilter,
  useCreatorFilter,
  useDocumentTypeFilter,
  useParentFilter,
  useUserFilter,
} from '@/components/table/filters';
import {
  decrementOpenIndex,
  getOpenIndex,
  incrementOpenIndex,
  setFirstOpenIndex,
  setLastOpenIndex,
  setOpenIndexToPreviousSetOrFirst,
  setOpenIndexToPreviousSetOrLast,
} from '@/components/table/open';
import { Row } from '@/components/table/row';
import type { ParsedRow } from '@/lib/data';
import { ALL_USECASES } from '@/lib/enums/all';
import type { CaseStatus } from '@/lib/enums/case-status';
import type { CreatorEnum } from '@/lib/enums/creator';
import type { DocumentTypeEnum } from '@/lib/enums/document-type';
import type { ParentEnum } from '@/lib/enums/parent';
import type { UserEnum } from '@/lib/enums/user';
import { isMetaKey } from '@/lib/meta-key';
import { matchUsecase } from '@/lib/usecase';
import { usecaseToKey } from '@/lib/usecase-key';

interface Props {
  rows: ParsedRow[];
  userServerFilter: UserEnum[];
  caseStatusServerFilter: CaseStatus[];
  documentTypeServerFilter: DocumentTypeEnum[];
  parentServerFilter: ParentEnum[];
  creatorServerFilter: CreatorEnum[];
}

export const Body = ({
  rows,
  userServerFilter,
  caseStatusServerFilter,
  documentTypeServerFilter,
  parentServerFilter,
  creatorServerFilter,
}: Props) => {
  const usersFilter = useUserFilter(userServerFilter);
  const caseStatusFilter = useCaseStatusFilter(caseStatusServerFilter);
  const documentTypeFilter = useDocumentTypeFilter(documentTypeServerFilter);
  const parentFilter = useParentFilter(parentServerFilter);
  const creatorFilter = useCreatorFilter(creatorServerFilter);

  useEffect(() => {
    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <TableBody>
      {ALL_USECASES.map((usecase, index) => {
        if (usersFilter.length !== 0 && !usersFilter.includes(usecase.user)) {
          return null;
        }

        if (caseStatusFilter.length !== 0 && !caseStatusFilter.includes(usecase.caseStatus)) {
          return null;
        }

        if (documentTypeFilter.length !== 0 && !documentTypeFilter.includes(usecase.documentType)) {
          return null;
        }

        if (parentFilter.length !== 0 && !parentFilter.includes(usecase.parent)) {
          return null;
        }

        if (creatorFilter.length !== 0 && !creatorFilter.includes(usecase.creator)) {
          return null;
        }

        const key = usecaseToKey(usecase);
        const row = rows.find((row) => matchUsecase(row.usecase, usecase));

        return <Row key={key} rowKey={key} usecase={usecase} row={row} rowNumber={index + 1} />;
      })}
    </TableBody>
  );
};

const listener = (event: KeyboardEvent) => {
  if (isMetaKey(event) && event.key === 's') {
    // Prevent default save action
    event.preventDefault();
    return;
  }

  if (event.key === 'Tab') {
    return tab(event);
  }

  // Ignore other keys when Shift is pressed
  if (event.shiftKey) {
    return;
  }

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft': {
      return isMetaKey(event) ? first(event) : decrementOpenIndex();
    }

    case 'ArrowDown':
    case 'ArrowRight': {
      return isMetaKey(event) ? last(event) : incrementOpenIndex();
    }

    case 'Home': {
      return first(event);
    }

    case 'End': {
      return last(event);
    }
  }
};

type KeyboardEventCallback = (event: KeyboardEvent) => void;

const wrapEvent =
  (callback: KeyboardEventCallback): KeyboardEventCallback =>
  (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback(event);
  };

const first = wrapEvent(() => (getOpenIndex() === null ? setOpenIndexToPreviousSetOrFirst() : setFirstOpenIndex()));

const last = wrapEvent(() => (getOpenIndex() === null ? setOpenIndexToPreviousSetOrLast() : setLastOpenIndex()));

const tab = wrapEvent((event) => (event.shiftKey ? decrementOpenIndex() : incrementOpenIndex()));

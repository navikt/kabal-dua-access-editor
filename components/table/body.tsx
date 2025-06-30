'use client';

import { TableBody } from '@navikt/ds-react/Table';
import { useEffect } from 'react';
import {
  decrementOpenIndex,
  getOpenIndex,
  incrementOpenIndex,
  setFirstOpenIndex,
  setLastOpenIndex,
  setOpenIndexToPreviousSetOrFirst,
} from '@/components/table/open';
import { Row } from '@/components/table/row';
import type { ParsedRow } from '@/lib/data';
import { ALL_USECASES } from '@/lib/enums/all';
import { usecaseToKey } from '@/lib/usecase-key';

interface Props {
  rows: ParsedRow[];
}

export const Body = ({ rows }: Props) => {
  useEffect(() => {
    window.addEventListener('keydown', listener);

    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <TableBody>
      {ALL_USECASES.map((usecase, index) => {
        const key = usecaseToKey(usecase);

        return <Row key={key} rowKey={key} usecase={usecase} rows={rows} rowNumber={index + 1} />;
      })}
    </TableBody>
  );
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
const listener = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    event.stopPropagation();

    if (event.shiftKey) {
      // Shift + Tab: Move to previous index
      decrementOpenIndex();
      return;
    }

    // Tab: Move to next index
    incrementOpenIndex();
    return;
  }

  if (getOpenIndex() === null) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      event.metaKey || event.ctrlKey ? setFirstOpenIndex() : setOpenIndexToPreviousSetOrFirst();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      event.metaKey || event.ctrlKey ? setLastOpenIndex() : setOpenIndexToPreviousSetOrFirst();
      return;
    }
  }

  if (event.shiftKey) {
    return; // Ignore other keys when Shift is pressed
  }

  if (event.key === 'Home') {
    // Home: Move to first index
    event.preventDefault();
    event.stopPropagation();
    setFirstOpenIndex();
    return;
  }

  if (event.key === 'End') {
    // End: Move to last index
    event.preventDefault();
    event.stopPropagation();
    setLastOpenIndex();
    return;
  }

  if (event.key === 'ArrowRight') {
    // ArrowRight: Move to next or last index
    event.preventDefault();
    event.stopPropagation();
    event.metaKey || event.ctrlKey ? setLastOpenIndex() : incrementOpenIndex();
    return;
  }

  if (event.key === 'ArrowLeft') {
    // ArrowLeft: Move to previous or first index
    event.preventDefault();
    event.stopPropagation();
    event.metaKey || event.ctrlKey ? setFirstOpenIndex() : decrementOpenIndex();
    return;
  }
};

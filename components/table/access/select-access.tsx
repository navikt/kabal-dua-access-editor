import { Button } from '@navikt/ds-react';
import { TableDataCell } from '@navikt/ds-react/Table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessSelector } from '@/components/table/access/access-selector';
import { AccessContainer } from '@/components/table/access/container';
import { Description } from '@/components/table/access/description';
import { accessHistory } from '@/components/table/access/history';
import { incrementOpenIndex, setOpenIndexById, unsetOpenIndex, useIsOpen } from '@/components/table/open';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import type { ParsedRow, RowUsecase } from '@/lib/data';
import { ACCESS_NAMES, Access } from '@/lib/enums/access';
import type { ActionEnum } from '@/lib/enums/actions';

export interface SelectAccessProps {
  row: ParsedRow | undefined;
  usecase: RowUsecase;
  action: ActionEnum;
  id: string;
}

export const SelectAccess = ({ row, usecase, action, id }: SelectAccessProps) => {
  const { user, caseStatus, documentType, parent, creator } = usecase;

  const cellRef = useRef<HTMLTableCellElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = useIsOpen(id);

  useOnClickOutside(cellRef, isOpen ? unsetOpenIndex : undefined);

  const [access, setAccess] = useState<Access>(row?.actions[action] ?? Access.UNSET);

  useEffect(
    () =>
      accessHistory.addListener(usecase, action, (newAccess) => {
        if (newAccess !== access) {
          setAccess(newAccess);
        }
      }),
    [access, action, usecase],
  );

  const updateAccess = useCallback(
    async (newAccess: Access) => {
      const previousAccess = access;

      if (previousAccess === newAccess) {
        return;
      }

      if (newAccess !== Access.UNSET) {
        incrementOpenIndex(); // Increment open index to open the next cell
      }

      setIsLoading(true);
      setAccess(newAccess);
      const { success } = accessHistory.update(usecase, action, previousAccess, newAccess);

      if (!(await success)) {
        setAccess(previousAccess); // Revert to previous access on error
      }

      setIsLoading(false);
    },
    [access, action, usecase],
  );

  const onCancel = useCallback(() => {
    buttonRef.current?.focus();
    unsetOpenIndex();
  }, []);

  return (
    <TableDataCell className="relative" ref={cellRef}>
      <Button
        type="button"
        size="small"
        variant="tertiary-neutral"
        className={`whitespace-nowrap w-full ${isOpen ? 'outline-2 outline-ax-border-focus' : ''}`}
        loading={isLoading}
        onClick={() => setOpenIndexById(id)}
        id={id}
        data-access-select
        ref={buttonRef}
      >
        <span className={getAccessColor(access)}>{ACCESS_NAMES[access]}</span>
      </Button>

      {isOpen ? (
        <AccessContainer>
          <Description
            user={user}
            status={caseStatus}
            documentType={documentType}
            parent={parent}
            creator={creator}
            action={action}
          />

          <AccessSelector onOptionClickAction={updateAccess} onCancelAction={onCancel} access={access} />
        </AccessContainer>
      ) : null}
    </TableDataCell>
  );
};

const ROL_COLOR_CLASS = 'text-ax-text-meta-purple-decoration';

const ACCESS_COLORS: Partial<Record<Access, string>> = {
  [Access.ALLOWED]: 'text-ax-text-success-decoration',
  [Access.UNSET]: 'text-ax-text-neutral',
  [Access.SENT_TO_MU]: 'text-ax-text-warning-decoration',
  [Access.SENT_TO_ROL]: ROL_COLOR_CLASS,
  [Access.ROL_REQUIRED]: ROL_COLOR_CLASS,
  [Access.NOT_SUPPORTED_ROL_QUESTIONS]: ROL_COLOR_CLASS,
  [Access.ROL_USER]: ROL_COLOR_CLASS,
  [Access.NOT_ASSIGNED_ROL]: ROL_COLOR_CLASS,
  [Access.NOT_SUPPORTED]: 'text-ax-text-neutral-decoration',
  [Access.NOT_ASSIGNED]: 'text-ax-text-accent-decoration',
  [Access.NOT_ASSIGNED_OR_MU]: 'text-ax-text-accent-decoration',
  [Access.NOT_ASSIGNED_OR_ROL]: 'text-ax-text-accent-decoration',
};

const DEFAULT_ACCESS_COLOR_CLASS = 'text-ax-text-danger-decoration';

const getAccessColor = (access: Access): string => ACCESS_COLORS[access] ?? DEFAULT_ACCESS_COLOR_CLASS;

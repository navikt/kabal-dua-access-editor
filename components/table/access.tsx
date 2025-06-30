import { TableDataCell } from '@navikt/ds-react/Table';
import { SelectAccess, type SelectAccessProps } from '@/components/table/access/select-access';
import { ACCESS_NAMES, Access } from '@/lib/enums/access';
import { getInitialAccess } from '@/lib/initial-access';

export const AccessCell = ({ action, usecase, ...rest }: SelectAccessProps) => {
  const initialAccess = getInitialAccess(action, usecase);

  if (initialAccess === Access.NOT_SUPPORTED) {
    return (
      <TableDataCell className="text-center text-ax-text-neutral-decoration">
        {ACCESS_NAMES[initialAccess]}
      </TableDataCell>
    );
  }

  return <SelectAccess {...rest} usecase={usecase} action={action} />;
};

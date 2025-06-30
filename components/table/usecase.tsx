import { Tag, type TagProps } from '@navikt/ds-react';
import { TableDataCell } from '@navikt/ds-react/Table';

interface UsecaseCellProps {
  children: string | null;
  variant: TagProps['variant'];
}

export const UsecaseCell = ({ children, variant }: UsecaseCellProps) => (
  <TableDataCell className="whitespace-nowrap">
    {children === null ? null : (
      <Tag variant={variant} size="small">
        {children}
      </Tag>
    )}
  </TableDataCell>
);

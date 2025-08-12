import { SelectAccess, type SelectAccessProps } from '@/components/table/access/select-access';

export const AccessCell = ({ action, usecase, ...rest }: SelectAccessProps) => {
  return <SelectAccess {...rest} usecase={usecase} action={action} />;
};

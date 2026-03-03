'use client';

import { BoxNew, Button, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { useAccessFilter, useSetAccessFilter } from '@/components/table/filters';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { ACCESS_NAMES, ACCESS_VALUES, type Access } from '@/lib/enums/access';

interface Props {
  filter: Access[];
}

export const AccessFilter = ({ filter }: Props) => {
  const accessFilter = useAccessFilter(filter);
  const setAccessFilter = useSetAccessFilter();

  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative z-50 w-fit whitespace-nowrap">
      <Button variant="secondary-neutral" size="small" onClick={() => setIsOpen(!isOpen)}>
        Tilgang ({accessFilter.length})
      </Button>

      {isOpen ? (
        <BoxNew position="absolute" background="default" shadow="dialog" borderRadius="medium" paddingInline="2">
          <CheckboxGroup
            size="small"
            legend="Tilgang"
            hideLegend
            value={accessFilter as string[]}
            onChange={setAccessFilter}
          >
            {ACCESS_VALUES.map((access) => (
              <Checkbox key={access} value={access}>
                {ACCESS_NAMES[access]}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </BoxNew>
      ) : null}
    </div>
  );
};

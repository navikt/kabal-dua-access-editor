import { CheckmarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, TextField } from '@navikt/ds-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ACCESS_NAMES, ACCESS_VALUES, Access } from '@/lib/enums/access';
import { fuzzyIncludes } from '@/lib/fuzzy-includes';
import { isMetaKey } from '@/lib/meta-key';

export interface Option {
  value: Access;
  label: string;
}

const OPTIONS: Option[] = ACCESS_VALUES.map((value) => ({
  value,
  label: ACCESS_NAMES[value],
}));

interface Props {
  onOptionClickAction: (value: Access) => void;
  onCancelAction: () => void;
  access: Access;
}

export const AccessSelector = ({ onOptionClickAction, onCancelAction, access }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState('');
  const [focus, setFocus] = useState(0);

  const filteredOptions = OPTIONS.filter((option) => fuzzyIncludes(option.label, filter));

  useEffect(() => {
    if (filteredOptions.length > 0) {
      setFocus((prev) => Math.min(prev, filteredOptions.length - 1));
    }
  }, [filteredOptions.length]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  const focusedOption = filteredOptions[focus];

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.shiftKey) {
        // Ignore all keys when Shift is pressed
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();

        onOptionClickAction(focusedOption?.value ?? Access.ALLOWED);
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        event.stopPropagation();

        if (isMetaKey(event)) {
          setFocus(filteredOptions.length - 1);
        } else {
          setFocus((prev) => (prev + 1) % filteredOptions.length);
        }
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        event.stopPropagation();

        if (isMetaKey(event)) {
          setFocus(0);
        } else {
          setFocus((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
        }
      }

      if (event.key === 'Home') {
        event.preventDefault();
        event.stopPropagation();
        setFocus(0);
      }

      if (event.key === 'End') {
        event.preventDefault();
        event.stopPropagation();
        setFocus(filteredOptions.length - 1);
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancelAction();
      }
    },
    [filteredOptions.length, onCancelAction, onOptionClickAction, focusedOption],
  );

  return (
    <BoxNew width="fit" background="default" shadow="dialog" borderRadius="medium" overflow="hidden" ref={ref}>
      <TextField
        size="small"
        label="Filter"
        hideLabel
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
        autoFocus
        onKeyDown={onKeyDown}
      />

      {filteredOptions.map(({ label, value }, index) => (
        <Button
          type="button"
          variant={focus === index ? 'primary' : 'tertiary-neutral'}
          size="small"
          icon={access === value ? <CheckmarkIcon aria-hidden /> : null}
          key={value}
          onClick={() => onOptionClickAction(value)}
          className="w-full justify-start whitespace-nowrap"
        >
          {label}
        </Button>
      ))}
    </BoxNew>
  );
};

import { HStack } from '@navikt/ds-react';

interface Props {
  children?: React.ReactNode;
}

export const AccessContainer = ({ children }: Props) => (
  <HStack position="absolute" right="1" wrap={false} align="start" className="top-full z-10">
    {children}
  </HStack>
);

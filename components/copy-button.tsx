'use client';
import { FilesIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface CopyButtonProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

export const CopyButton = ({ text, children, className }: CopyButtonProps) => (
  <Button icon={<FilesIcon aria-hidden />} onClick={() => navigator.clipboard.writeText(text)} className={className}>
    {children}
  </Button>
);

import { BoxNew, HStack, Tooltip } from '@navikt/ds-react';
import type { ParsedRow } from '@/lib/data';
import { useRowsDone, useRowsTotal } from '@/lib/row-remaining';

interface RemainingBadgeProps {
  rows: ParsedRow[];
}

export const RemainingBadge = ({ rows }: RemainingBadgeProps) => {
  const total = useRowsTotal(rows);
  const done = useRowsDone(rows, total);

  return (
    <Tooltip content="Ferdige tilgangsinnstillinger" placement="top">
      <BoxNew
        paddingInline="4"
        paddingBlock="2"
        borderRadius="large"
        background="accent-soft"
        overflow="hidden"
        position="fixed"
        bottom="4"
        left="14"
        shadow="dialog"
        className="z-100 hover:opacity-60 transition-opacity"
      >
        <HStack align="center" justify="center">
          <Content numerator={done} denominator={total} />
        </HStack>
      </BoxNew>
    </Tooltip>
  );
};

interface ContentProps {
  numerator: number;
  denominator: number;
}

const Content = ({ numerator, denominator }: ContentProps) => {
  if (denominator === 0) {
    return (
      <>
        <ProgressBar percent={100} />

        <span className="z-10">{numerator.toString(10)}/0 (∞ %)</span>
      </>
    );
  }

  const percent = (numerator / denominator) * 100;

  return (
    <>
      <ProgressBar percent={percent} />

      <span className="z-10">
        {numerator.toString(10)}/{denominator.toString(10)} ({percent.toFixed(2)} %)
      </span>
    </>
  );
};

const ProgressBar = ({ percent }: { percent: number }) => (
  <BoxNew position="absolute" left="0" top="0" bottom="0" width={`${percent}%`} background="accent-strong" />
);

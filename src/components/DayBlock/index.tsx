'use client';

import { SESSIONS, sessionRange } from '@/constants';

import { Container, DayButton, Range } from './style';

type DayBlockProps = {
  block: number;
  setBlock: (block: number) => void;
  // Usa a cor de cada sessão (cronograma); sem ela mantém o visual neutro
  colored?: boolean;
  counts?: Record<number, number>;
};

export function DayBlock({ block, setBlock, colored, counts }: DayBlockProps) {
  return (
    <Container $colored={colored}>
      {SESSIONS.map((session) => (
        <DayButton
          key={session.id}
          type="button"
          aria-pressed={block === session.id}
          $active={block === session.id}
          $color={colored ? session.color : undefined}
          onClick={() => setBlock(session.id)}
        >
          {session.label}
          {counts ? ` (${counts[session.id] ?? 0})` : ''}
          <Range>{sessionRange(session.schedules)}</Range>
        </DayButton>
      ))}
    </Container>
  );
}

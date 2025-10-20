'use client';

import { Container, DayButton } from './style';

export function DayBlock({ block, setBlock }) {
  return (
    <Container>
      <DayButton
        type="button"
        active={block == 1 ? true : false}
        onClick={() => setBlock(1)}
      >
        Sessão 1
      </DayButton>

      <DayButton
        type="button"
        active={block == 2 ? true : false}
        onClick={() => setBlock(2)}
      >
        Sessão 2
      </DayButton>
    </Container>
  );
}

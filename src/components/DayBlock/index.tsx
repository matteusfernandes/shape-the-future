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
        Bloco 1
      </DayButton>

      <DayButton
        type="button"
        active={block == 2 ? true : false}
        onClick={() => setBlock(2)}
      >
        Bloco 2
      </DayButton>

      <DayButton
        type="button"
        active={block == 3 ? true : false}
        onClick={() => setBlock(3)}
      >
        Bloco 3
      </DayButton>
    </Container>
  );
}

'use client';

import { Container, DayButton } from './style';

export function DayBlock({ block, setBlock }) {
  return (
    <Container>
      <DayButton type="button" active={block} onClick={() => setBlock(true)}>
        Bloco 1
      </DayButton>

      <DayButton type="button" active={!block} onClick={() => setBlock(false)}>
        Bloco 2
      </DayButton>
    </Container>
  );
}

import { Container, DayButton } from './style';

export function DayBlock({
  dayOne = 'Bloco 1',
  dayTwo = 'Bloco 2',
  block,
  setBlock
}) {
  return (
    <Container>
      <DayButton type="button" active={block} onClick={() => setBlock(true)}>
        {dayOne}
      </DayButton>
      <DayButton type="button" active={!block} onClick={() => setBlock(false)}>
        {dayTwo}
      </DayButton>
    </Container>
  );
}

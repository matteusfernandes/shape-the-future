import { Container, LetterSpan } from './style';

const data = [
  'inovação',
  'propósito',
  'metaverso',
  'sustentabilidade',
  'blockchain',
  'impacto positivo',
  'novos materiais',
  'internet das coisas',
  'igualdade',
  'educação',
  'autoconhecimento',
  'aprendizagem',
  'futurismo'
];

export function Lettering() {
  return (
    <Container>
      {data.map((text) => (
        <LetterSpan key={text}>{text}</LetterSpan>
      ))}
    </Container>
  );
}

import Link from 'next/link';
import { Container, Content, Title } from './style';

type Result = {
  id: number;
  background: string;
  link: string;
  title: string;
};

type ResultsLinksProps = {
  results: Result[];
};

export function ResultsLinks({ results }: ResultsLinksProps) {
  return (
    <Container>
      {results?.map((result) => (
        <Content key={result.id.toString()} background={result.background}>
          <Link href={result.link}>
            <Title>{result.title}</Title>
          </Link>
        </Content>
      ))}
    </Container>
  );
}

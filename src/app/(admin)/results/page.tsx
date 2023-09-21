import Link from 'next/link';
import { Container, Content, Title } from './style';

export default function ResultsLinks() {
  return (
    <Container>
      <Content background="/images/avaliacoes.svg">
        <Link href="/results/space">
          <Title>Espaços</Title>
        </Link>
      </Content>

      <Content background="/images/jurados.svg">
        <Link href="/results/judget">
          <Title>Jurados</Title>
        </Link>
      </Content>

      <Content background="/images/populares.svg">
        <Link href="/results/project">
          <Title>Projetos</Title>
        </Link>
      </Content>
    </Container>
  );
}

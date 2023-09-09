import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Content, Title } from './style';

import avaliacoes from '../../images/avaliacoes.svg';
import justados from '../../images/jurados.svg';
import populares from '../../images/populares.svg';

export function ResultsLinks({ one, two, three }) {
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (route) => {
      navigate(route);
    },
    [navigate]
  );

  return (
    <Container>
      <Content background={avaliacoes} onClick={() => handleNavigate(one.page)}>
        <Title>{one.title}</Title>
      </Content>

      <Content background={justados} onClick={() => handleNavigate(two.page)}>
        <Title>{two.title}</Title>
      </Content>

      <Content
        background={populares}
        onClick={() => handleNavigate(three.page)}
      >
        <Title>{three.title}</Title>
      </Content>
    </Container>
  );
}

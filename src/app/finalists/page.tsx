'use client';

import { FinalistsItem } from '@/components/FinalistsItem/FinalistsItem';
import { Container, ContainerEmpty, Info } from './style';
import { http } from '@/lib/http';
import _ from 'lodash';
import { Evaluation } from '../evaluations/evaluations';
import { useCallback, useEffect, useState } from 'react';

export default function Finalists() {
  const [finalists, setFinalist] = useState<Evaluation[]>([]);
  const [vote, setVote] = useState(false);

  const loadedFinalistsAndVote = useCallback(async () => {
    const [finalists, vote] = await Promise.all([
      http.get('/projects/finalists'),
      http.get('/vote')
    ]);

    setFinalist(finalists.data);
    setVote(vote.data[0].active);
  }, []);

  useEffect(() => {
    loadedFinalistsAndVote();
  }, [loadedFinalistsAndVote]);

  if (_.isEmpty(finalists)) {
    return (
      <ContainerEmpty>
        <Info>Os projetos ainda estão em avaliação</Info>
      </ContainerEmpty>
    );
  }

  return (
    <Container>
      {finalists.map((finalist: Evaluation, index: number) => (
        <FinalistsItem
          key={finalist.id}
          group={index}
          title={finalist.title}
          students={finalist.students}
          project={finalist}
          isVote={vote}
        />
      ))}
    </Container>
  );
}

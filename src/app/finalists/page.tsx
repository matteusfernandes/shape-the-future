import { FinalistsItem } from '@/components/FinalistsItem/FinalistsItem';
import { Container, ContainerEmpty, Info } from './style';
import { http } from '@/lib/http';
import _ from 'lodash';
import { Evaluation } from '../evaluations/evaluations';

export default async function Finalists() {
  const { data: finalists } = await http.get('/projects/finalists');
  const { data: vote } = await http.get('/vote');

  if (_.isEmpty(finalists)) {
    return (
      <ContainerEmpty>
        <Info>Os projetos ainda estão em avaliação</Info>
      </ContainerEmpty>
    );
  }

  return (
    <Container>
      {finalists.map((finalist: Evaluation, index: string) => (
        <FinalistsItem
          key={finalist.id}
          group={index}
          title={finalist.title}
          students={finalist.students}
          project={finalist}
          isVote={vote[0].active}
        />
      ))}
    </Container>
  );
}

'use client';

import {
  Container,
  Content,
  Finalist,
  Group,
  GroupItem,
  GroupTitle,
  Info,
  Select
} from './style';

import { Button } from '../Button';

export function FinalistsItem({
  background,
  horizontal,
  vote,
  evaluation,
  schedule,
  title,
  students,
  project,
  // getProject,
  group,
  notes
}) {
  return (
    <Container evaluation={evaluation}>
      <Content
        background={background}
        horizontal={horizontal}
        evaluation={evaluation}
      >
        {horizontal ? (
          <Info horizontal>{schedule}H</Info>
        ) : (
          <Info>Grupo {group + 1}</Info>
        )}

        <Info horizontal>{title}</Info>

        {!vote && vote !== 0 && (
          <Group>
            {!horizontal && !vote && <GroupTitle>Integrantes:</GroupTitle>}
            {students &&
              students.map((student) => (
                <GroupItem horizontal key={student.id}>
                  {student.name}
                </GroupItem>
              ))}
          </Group>
        )}

        {horizontal && !evaluation && <Info horizontal>{notes}</Info>}

        {horizontal && !evaluation && (
          <Finalist horizontal>
            <Select active={project?.finalist} /> Finalista
          </Finalist>
        )}

        {vote && <Info>{vote > 1 ? `${vote} votos` : `${vote} voto`}</Info>}
      </Content>

      {!horizontal && <Button label="Votar" borderless />}
    </Container>
  );
}

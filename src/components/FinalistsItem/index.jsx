import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';

import {
  Container,
  Content,
  Finalist,
  Group,
  GroupItem,
  GroupTitle,
  Info
} from './style';

import { Button } from '../Button';
import { Select } from '../../screens/EvaluationParticipants/style';
import { http } from '../../helpers/http';
import { useShapeContext } from '../../hooks/useShapeContext';

export function FinalistsItem({
  background,
  horizontal,
  vote,
  evaluation,
  schedule,
  title,
  students,
  project,
  getProject,
  group,
  notes
}) {
  const { isJudge } = useShapeContext();
  const [isVote, setIsVote] = useState([]);
  const navigate = useNavigate();

  const handleVoteStatus = useCallback(async () => {
    const { data } = await http.get('/vote');
    setIsVote(data[0].active);
  }, []);

  useEffect(() => {
    handleVoteStatus();
  }, [handleVoteStatus]);

  const handleNavigate = useCallback(() => {
    navigate('participants', {
      state: {
        project
      }
    });
  }, [navigate, project]);

  const handleFinalists = useCallback(async () => {
    await http.put(`/projects/finalist/update/${project?.id}`, {
      finalist: !project.finalist
    });
    getProject && getProject();
  }, [project, getProject]);

  const handlePublicVote = useCallback(async () => {
    try {
      await http.post(`/vote/public`, {
        projectId: project?.id
      });
      alert('Voto computado');
      navigate('/');
    } catch (error) {
      alert('Votação ainda não foi iniciada');
    }
  }, [navigate, project?.id]);

  const handleJudgeVote = useCallback(async () => {
    try {
      await http.post(`/vote/judge`, {
        projectId: project?.id
      });
      alert('Voto computado');
    } catch (error) {
      alert('Você já votou');
    }
  }, [project]);

  return (
    <Container evaluation={evaluation} onClick={evaluation && handleNavigate}>
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
            <Select onClick={handleFinalists} active={project?.finalist} />{' '}
            Finalista
          </Finalist>
        )}

        {vote && <Info>{vote > 1 ? `${vote} votos` : `${vote} voto`}</Info>}
      </Content>

      {!horizontal && isVote && (
        <Button
          label="Votar"
          borderless
          onClick={isJudge ? handleJudgeVote : handlePublicVote}
        />
      )}
    </Container>
  );
}

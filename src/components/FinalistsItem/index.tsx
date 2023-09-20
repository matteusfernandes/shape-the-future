'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { Evaluation, Student } from '@/app/evaluations/evaluations';

import { Button } from '../Button';

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

type FinalistsItemProps = {
  background: string;
  horizontal: boolean;
  vote: number;
  evaluation: boolean;
  schedule: string;
  title: string;
  students: Student[];
  project: Evaluation;
  getProject: () => void;
  group: string;
  notes: string;
};

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
}: FinalistsItemProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isVote, setIsVote] = useState([]);

  const handleNavigate = useCallback(() => {
    const urlParams = new URLSearchParams({
      id: project.id.toString(),
      title: project.title,
      schedule: project.schedule
    });
    router.push(`/evaluations/participant?${urlParams}`);
  }, [project.id, project.schedule, project.title, router]);

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
      toast.success('Voto computado');
      router.push('/');
    } catch (error) {
      toast.error('Votação ainda não foi iniciada');
    }
  }, [project?.id, router]);

  const handleJudgeVote = useCallback(async () => {
    try {
      await http.post(`/vote/judge`, {
        projectId: project?.id
      });
      toast.success('Voto computado');
    } catch (error) {
      toast.error('Você já votou');
    }
  }, [project]);

  const handleVoteStatus = useCallback(async () => {
    const { data } = await http.get('/vote');
    setIsVote(data[0].active);
  }, []);

  useEffect(() => {
    handleVoteStatus();
  }, [handleVoteStatus]);

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
            <Select active={project?.finalist} onClick={handleFinalists} />{' '}
            Finalista
          </Finalist>
        )}

        {vote && <Info>{vote > 1 ? `${vote} votos` : `${vote} voto`}</Info>}
      </Content>

      {!horizontal && isVote && (
        <Button
          label="Votar"
          borderless
          onClick={
            session?.user.role === 'judge' ? handleJudgeVote : handlePublicVote
          }
        />
      )}
    </Container>
  );
}

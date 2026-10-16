'use client';
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AxiosError } from 'axios';
import { PUBLIC_VOTE_COOLDOWN_SECONDS } from '@/constants';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { http } from '@/lib/http';
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
import { FinalistsItemProps } from '.';

const LAST_VOTE_KEY = 'stf:ultimo-voto-popular';

// Segundos que faltam para este navegador poder votar de novo
const secondsToVoteAgain = () => {
  try {
    const last = Number(localStorage.getItem(LAST_VOTE_KEY));
    const wait = Math.ceil(
      (last + PUBLIC_VOTE_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000
    );
    return last && wait > 0 ? wait : 0;
  } catch {
    return 0;
  }
};

const rememberVote = () => {
  try {
    localStorage.setItem(LAST_VOTE_KEY, String(Date.now()));
  } catch {
    // sem localStorage: o servidor aplica o intervalo mesmo assim
  }
};

// Mensagem enviada pela API (ex.: "A votação não está aberta.")
const apiMessage = (error: unknown, fallback: string) =>
  (error as AxiosError<{ message?: string }>)?.response?.data?.message ??
  fallback;

export function FinalistsItem({
  background,
  horizontal,
  vote,
  isVote = false,
  evaluation = false,
  schedule,
  title,
  students,
  project,
  group,
  notes
}: FinalistsItemProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isVoting, setIsVoting] = useState(false);

  const handleNavigate = useCallback(() => {
    const urlParams = new URLSearchParams({
      id: project!.id.toString(),
      title: project!.title,
      schedule: project!.schedule
    });

    router.push(`/evaluations/participant?${urlParams}`);
  }, [project, router]);

  const handleFinalists = useCallback(async () => {
    try {
      const { data } = await http.put(
        `/projects/finalist/update/${project?.id}`,
        {
          finalist: !project?.finalist
        }
      );
      router.refresh();
      if (data.finalist) {
        toast.success(`${project?.title} adicionado aos finalistas`);
      } else {
        toast.warning(`${project?.title} removido dos finalistas`);
      }
    } catch {
      toast.error(`Erro ao habilitar finalista`);
    }
  }, [project, router]);

  const handlePublicVote = useCallback(async () => {
    if (isVoting) return; // Impede múltiplos cliques enquanto "isVoting" é true

    const wait = secondsToVoteAgain();
    if (wait) {
      toast.info(`Voto registrado! Aguarde ${wait}s para votar novamente.`, {
        toastId: 'intervalo-voto'
      });
      return;
    }

    setIsVoting(true);
    try {
      await http.post(`/vote/public`, {
        projectId: project?.id
      });
      rememberVote();
      toast.success('Voto computado');
      router.push('/');
    } catch (error) {
      toast.error(apiMessage(error, 'Não foi possível registrar o voto'));
      setIsVoting(false);
    }
  }, [project?.id, router, isVoting]);

  const handleJudgeVote = useCallback(async () => {
    if (isVoting) return; // Evita voto duplicado com cliques repetidos

    setIsVoting(true);
    try {
      await http.post(`/vote/judge`, {
        projectId: project?.id
      });
      toast.success('Voto computado');
    } catch (error) {
      toast.error(apiMessage(error, 'Não foi possível registrar o voto'));
    } finally {
      setIsVoting(false);
    }
  }, [project, isVoting]);

  return (
    <Container
      evaluation={evaluation}
      onClick={() => evaluation && handleNavigate()}
    >
      <Content
        background={background}
        horizontal={horizontal}
        evaluation={evaluation}
      >
        {horizontal ? (
          <Info horizontal>{schedule}H</Info>
        ) : (
          <Info>Grupo {group ? group + 1 : null}</Info>
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
          label={isVoting ? 'Enviando...' : 'Votar'}
          borderless
          disabled={isVoting}
          onClick={
            session?.user.role === 'judge' ? handleJudgeVote : handlePublicVote
          }
        />
      )}
    </Container>
  );
}

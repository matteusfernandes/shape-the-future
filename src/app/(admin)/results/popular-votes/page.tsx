'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '@/lib/http';

import { FinalistsItem } from '@/components/FinalistsItem';

import { Button, Container, Content, Selected, WrapperButton } from './style';
import { useRouter } from 'next/navigation';

export interface PopularVotes {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
  students: Student[];
  publicVotes: PublicVote[];
}

export interface Student {
  id: number;
  name: string;
  projectId: number;
  spaceId: number;
}

export interface PublicVote {
  id: number;
  projectId: number;
}

export default function VotesForm() {
  const { refresh } = useRouter();
  const [popular, setPopular] = useState<PopularVotes[]>([]);
  const [votes, setVotes] = useState(true);

  const loadVotesAndPopular = useCallback(async () => {
    try {
      const [popular, votes] = await Promise.all([
        http.get('/vote/public'),
        http.get('/vote')
      ]);
      setPopular(popular.data);
      setVotes(votes.data[0].active);
    } catch (error) {
      toast.warning(error!.response!.data!.message);
    }
  }, []);

  const handleActive = useCallback(async () => {
    const { data } = await http.put('/vote', {
      active: !votes
    });
    toast.success(data.message);
    await loadVotesAndPopular();
    await refresh();
  }, [loadVotesAndPopular, refresh, votes]);

  const popularFiltered = useMemo(() => {
    return popular.sort(
      (prev, next) => prev.publicVotes.length + next.publicVotes.length
    );
  }, [popular]);

  useEffect(() => {
    loadVotesAndPopular();
  }, [loadVotesAndPopular]);

  return (
    <Container>
      <WrapperButton>
        <Button>Votos Populares</Button>
        <Selected active={votes} onClick={() => handleActive()}>
          {votes ? 'ativo' : 'inativo'}
        </Selected>
      </WrapperButton>

      <Content>
        {popularFiltered.map((item, index) => (
          <FinalistsItem
            title={item.title}
            key={item.id.toString()}
            vote={item.publicVotes.length}
            group={index.toString()}
          />
        ))}
      </Content>
    </Container>
  );
}

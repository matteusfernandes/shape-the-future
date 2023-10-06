//  @typescript-eslint/no-explicit-any

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { http } from '@/lib/http';

import { FinalistsItem } from '@/components/FinalistsItem/FinalistsItem';

import { Button, Container, Content, Selected, WrapperButton } from './style';
import { AxiosError } from 'axios';
import { LoadingContent } from '@/app/timeline/style';
import _ from 'lodash';

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
  const [popular, setPopular] = useState<PopularVotes[]>([]);
  const [votes, setVotes] = useState(false);

  const loadVotesAndPopular = useCallback(async () => {
    try {
      const [popular, votes] = await Promise.all([
        http.get('/vote/public'),
        http.get('/vote')
      ]);
      setPopular(popular.data);
      setVotes(votes.data[0].active);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.warning(error?.response?.data?.message);
        setPopular([]);
        setVotes(true);
      }
    }
  }, []);

  const handleActive = useCallback(async () => {
    const { data } = await http.put('/vote', {
      active: !votes
    });

    toast.success(data.message);
    await loadVotesAndPopular();
  }, [loadVotesAndPopular, votes]);

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
        <Selected active={votes} onClick={handleActive}>
          {votes ? 'ativo' : 'inativo'}
        </Selected>
      </WrapperButton>

      <Content>
        {_.isEmpty(popular) ? (
          <LoadingContent>Votação iniciada</LoadingContent>
        ) : (
          popularFiltered.map((item, index) => (
            <FinalistsItem
              title={item.title}
              key={item.id.toString()}
              vote={item.publicVotes.length}
              group={index}
            />
          ))
        )}
      </Content>
    </Container>
  );
}

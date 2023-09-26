'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { http } from '@/lib/http';
import { FinalistsItem } from '@/components/FinalistsItem';

import { Button, Container, Content, WrapperButton } from './style';

export default function JuryVotes() {
  const [judge, setJudge] = useState([]);

  const handleJudgeVotes = useCallback(async () => {
    try {
      const { data } = await http.get('/vote/judge');
      setJudge(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const judgeFiltered = useMemo(() => {
    return judge.sort(
      (prev, next) => prev.juryVotes.length + next.juryVotes.length
    );
  }, [judge]);

  useEffect(() => {
    handleJudgeVotes();
  }, [handleJudgeVotes]);

  return (
    <Container>
      <WrapperButton>
        <Button>Votos dos Jurados</Button>
      </WrapperButton>

      <Content>
        {judgeFiltered.map((item, index) => (
          <FinalistsItem
            title={item.title}
            key={item.id.toString()}
            vote={item.juryVotes.length}
            group={index}
          />
        ))}
      </Content>
    </Container>
  );
}

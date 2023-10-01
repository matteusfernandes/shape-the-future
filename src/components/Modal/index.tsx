import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { http } from '@/lib/http';
import { Judge } from '@/app/timeline/timelines';

import * as S from './style';
import { evaluation, options } from './constants';

type ModalProps = {
  judge: Judge;
  onClose: () => void;
};

type VoteDetails = {
  [key: string]: number;
};

export const Modal = ({ judge, onClose }: ModalProps) => {
  const [voteDetails, setVoteDetails] = useState<VoteDetails>({});

  const handleVote = useCallback(async () => {
    const { data } = await http.get(`/vote/${judge.id}`);

    setVoteDetails(_.first(data) as VoteDetails);
  }, [judge]);

  const total = useMemo(() => {
    return Object.keys(
      _.pick(voteDetails, [
        'reqCommunication',
        'reqCreation',
        'reqIdentify',
        'reqInteraction',
        'reqProject'
      ])
    ).reduce((acc, next) => {
      return acc + voteDetails[next] / 10;
    }, 0);
  }, [voteDetails]);

  useEffect(() => {
    handleVote();
  }, [handleVote]);

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title>Votos</S.Title>
        <S.Close onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="red"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </S.Close>
      </S.Header>

      <S.Body>
        <S.Name>Jurado: {judge?.username}</S.Name>

        {_.isEmpty(voteDetails) ? (
          <h3>Jurado ainda não votou!</h3>
        ) : (
          <>
            {Object.keys(
              _.pick(voteDetails, [
                'reqCommunication',
                'reqCreation',
                'reqIdentify',
                'reqInteraction',
                'reqProject'
              ])
            ).map((vote) => {
              return (
                <S.Line key={vote}>
                  <S.Option>{evaluation[vote]}</S.Option>

                  <S.Item>{options[vote][voteDetails[vote]]}</S.Item>

                  <S.ItemValue>{voteDetails[vote] / 10} pontos</S.ItemValue>
                </S.Line>
              );
            })}

            <S.Total>Total: {total} pontos</S.Total>
          </>
        )}
      </S.Body>
    </S.Wrapper>
  );
};

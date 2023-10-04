import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { http } from '@/lib/http';
import { Judge } from '@/app/timeline/timelines';

import * as S from './style';
import { evaluation, options } from './constants';

type ModalProps = {
  judge: Judge;
  onClose: () => void;
};

type VoteDetails = {
  id: number;
  projectId: number;
  reqCommunication: number;
  reqCreation: number;
  reqIdentify: number;
  reqInteraction: number;
  reqProject: number;
  userId: number;
  project: {
    title: string;
  };
};

export const Modal = ({ judge, onClose }: ModalProps) => {
  const [voteDetails, setVoteDetails] = useState<VoteDetails[]>([]);

  const handleVote = useCallback(async () => {
    const { data } = await http.get(`/vote/${judge.id}`);

    setVoteDetails(data as VoteDetails[]);
  }, [judge]);

  const total = useCallback((details) => {
    return Object.keys(
      _.pick(details, [
        'reqCommunication',
        'reqCreation',
        'reqIdentify',
        'reqInteraction',
        'reqProject'
      ])
    ).reduce((acc, next) => {
      return acc + details[next] / 10;
    }, 0);
  }, []);

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
            {voteDetails.map((details) => (
              <>
                <S.Title>{details?.project?.title}</S.Title>

                {Object.keys(
                  _.pick(details, [
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

                      <S.Item>{options[vote][details[vote]]}</S.Item>

                      <S.ItemValue>{details[vote] / 10}</S.ItemValue>
                    </S.Line>
                  );
                })}

                <S.Total>total de pontos: {total(details)}</S.Total>
              </>
            ))}
          </>
        )}
      </S.Body>
    </S.Wrapper>
  );
};

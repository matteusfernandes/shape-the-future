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
  [key: string]: number;
};

export const Modal = ({ judge, onClose }: ModalProps) => {
  const [voteDetails, setVoteDetails] = useState<VoteDetails>({});

  const handleVote = useCallback(async () => {
    const { data } = await http.get(`/vote/${judge.id}`);

    setVoteDetails(_.first(data) as VoteDetails);
  }, [judge]);

  useEffect(() => {
    handleVote();
  }, [handleVote]);

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title>Votos</S.Title>
        <S.Close onClick={onClose}>❎</S.Close>
      </S.Header>

      <S.Body>
        <S.Name>Jurado: {judge?.username}</S.Name>

        {_.isEmpty(voteDetails) ? (
          <h3>Jurado ainda não votou!</h3>
        ) : (
          Object.keys(
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

                <S.ItemValue>{voteDetails[vote]} pontos</S.ItemValue>
              </S.Line>
            );
          })
        )}
      </S.Body>
    </S.Wrapper>
  );
};

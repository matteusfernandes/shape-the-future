import _ from 'lodash';
import { useCallback } from 'react';

import * as S from './style';
import { evaluation, options } from './constants';

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

type ModalProps = {
  showModal: VoteDetails;
  onClose: () => void;
};

export const Modal = ({ showModal, onClose }: ModalProps) => {
  const total = useCallback((showModal) => {
    return Object.keys(
      _.pick(showModal, [
        'reqCommunication',
        'reqCreation',
        'reqIdentify',
        'reqInteraction',
        'reqProject'
      ])
    ).reduce((acc, next) => {
      return acc + showModal[next] / 10;
    }, 0);
  }, []);

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
        <S.Name>{showModal?.project?.title}</S.Name>

        <>
          {Object.keys(
            _.pick(showModal, [
              'reqCommunication',
              'reqCreation',
              'reqIdentify',
              'reqInteraction',
              'reqProject'
            ])
          ).map((vote) => {
            return (
              <S.Line key={vote}>
                <S.WrapperOption>
                  <S.Option>{evaluation[vote]}</S.Option>

                  <S.Item>{options[vote][showModal[vote]]}</S.Item>
                </S.WrapperOption>

                <S.ItemValue>{showModal[vote] / 10}</S.ItemValue>
              </S.Line>
            );
          })}

          <S.Total>total de pontos: {total(showModal)}</S.Total>
        </>
      </S.Body>
    </S.Wrapper>
  );
};

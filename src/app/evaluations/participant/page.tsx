'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button';
import { http } from '@/lib/http';

import {
  Cell,
  CellInner,
  CellLabel,
  Container,
  InfoDescription,
  InfoTitle,
  Row,
  WrapperInfo,
  Select,
  Info
} from './style';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type EvaluationParticipantsProps = {
  searchParams: {
    id: string;
    schedule: string;
    title: string;
  };
};

type Evaluation = {
  option: number | null;
  total: number;
};

type EvaluationInput = {
  [key: string]: Evaluation;
};

export default function EvaluationParticipants({
  searchParams
}: EvaluationParticipantsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [evaluation, setEvaluation] = useState<EvaluationInput>({
    reqIdentify: {
      option: null,
      total: 0
    },
    reqProject: {
      option: null,
      total: 0
    },
    reqCreation: {
      option: null,
      total: 0
    },
    reqInteraction: {
      option: null,
      total: 0
    },
    reqCommunication: {
      option: null,
      total: 0
    }
  });

  const handleEvaluationFinish = useCallback(async () => {
    try {
      await http.post('/evaluation', {
        projectId: _.toNumber(searchParams.id),
        reqIdentify: evaluation.reqIdentify.total,
        reqProject: evaluation.reqProject.total,
        reqCreation: evaluation.reqCreation.total,
        reqInteraction: evaluation.reqInteraction.total,
        reqCommunication: evaluation.reqCommunication.total
      });
      toast.success('Avaliação adicionada');
      router.push('/');
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [
    evaluation.reqCommunication.total,
    evaluation.reqCreation.total,
    evaluation.reqIdentify.total,
    evaluation.reqInteraction.total,
    evaluation.reqProject.total,
    router,
    searchParams.id
  ]);

  const handleEvaluation = useCallback(
    ({
      key,
      option,
      total
    }: {
      key: string;
      option: number;
      total: number;
    }) => {
      setEvaluation((prev) => {
        if (prev[key] && prev[key].option === option) {
          return {
            ...prev,
            [key]: {
              option: null,
              total: 0
            }
          };
        }

        return {
          ...prev,
          [key]: {
            option,
            total
          }
        };
      });
    },
    []
  );

  return (
    <Container>
      <Row>
        <WrapperInfo noBorder mobile>
          <Info>{searchParams.title}</Info>
          <Info>{searchParams.schedule}H</Info>
        </WrapperInfo>
      </Row>

      <Row>
        <WrapperInfo>
          <InfoTitle>Identificação</InfoTitle>
          <InfoDescription>
            o grupo tinha um problema claramente definido e fez boa pesquisa
          </InfoDescription>
        </WrapperInfo>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 0}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 0, total: 5 })
              }
            />
            <CellLabel>Problema não está claramente definido</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 1}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 1, total: 5 })
              }
            />
            <CellLabel>Pouquíssima pesquisa</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 2}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 2, total: 10 })
              }
            />
            <CellLabel>Definição do problema relativamente clara</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 3}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 3, total: 10 })
              }
            />
            <CellLabel>Alguma pesquisa, mas qualidade duvidosa</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 4}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 4, total: 15 })
              }
            />
            <CellLabel>Definição do problema totalmente clara</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 5}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 5, total: 15 })
              }
            />
            <CellLabel>Grande variedade de pesquisa de qualidade</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqIdentify'].option === 6}
              onClick={() =>
                handleEvaluation({ key: 'reqIdentify', option: 6, total: 20 })
              }
            />
            <CellLabel>Trabalho impecável no critério avaliado</CellLabel>
          </CellInner>
        </Cell>
      </Row>

      <Row>
        <WrapperInfo>
          <InfoTitle>Projeto</InfoTitle>
          <InfoDescription>
            o grupo gerou ideias inovadoras independentemente de selecionar e
            planejar qual delas desenvolver.
          </InfoDescription>
        </WrapperInfo>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 0}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 0, total: 5 })
              }
            />
            <CellLabel>Equipe gerou pouquíssimas ideias</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 1}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 1, total: 5 })
              }
            />
            <CellLabel>
              Pouquíssimo planejamento com participação de alguns membros da
              equipe
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 2}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 2, total: 10 })
              }
            />
            <CellLabel>
              Evidências de que a equipe gerou algumas ideias
            </CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 3}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 3, total: 10 })
              }
            />
            <CellLabel>
              Alguma planejamento de efetivo com participação de alguns membros
              do grupo
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 4}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 4, total: 15 })
              }
            />
            <CellLabel>
              Evidências de que a equipe gerou muitas ideias
            </CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 5}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 5, total: 15 })
              }
            />
            <CellLabel>
              Planejamento altamente efetivo com participação de todos os
              membros do grupo
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqProject'].option === 6}
              onClick={() =>
                handleEvaluation({ key: 'reqProject', option: 6, total: 20 })
              }
            />
            <CellLabel>Trabalho impecável no critério avaliado</CellLabel>
          </CellInner>
        </Cell>
      </Row>

      <Row>
        <WrapperInfo>
          <InfoTitle>Criação</InfoTitle>
          <InfoDescription>
            O grupo desenvolveu uma ideia original ou baseou-se em uma ideia
            existente e criou um protótipo/desenho para representar sua solução.
          </InfoDescription>
        </WrapperInfo>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 0}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 0, total: 5 })
              }
            />
            <CellLabel>Desenvolvimento mínimo de solução inovadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 1}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 1, total: 5 })
              }
            />
            <CellLabel>Nenhum protótipo/desenho da solução</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 2}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 2, total: 10 })
              }
            />
            <CellLabel>Desenvolvimento parcial de solução inovadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 3}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 3, total: 10 })
              }
            />
            <CellLabel>
              Protótipo/desenho simples que ajuda a compartilhar a solução
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 4}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 4, total: 15 })
              }
            />
            <CellLabel>Desenvolvimento integral da solução inovadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 5}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 5, total: 15 })
              }
            />
            <CellLabel>
              Protótipo/desenho detalhado que ajuda a compartilhar a solução
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCreation'].option === 6}
              onClick={() =>
                handleEvaluation({ key: 'reqCreation', option: 6, total: 20 })
              }
            />
            <CellLabel>Trabalho impecável no critério avaliado</CellLabel>
          </CellInner>
        </Cell>
      </Row>

      <Row>
        <WrapperInfo>
          <InfoTitle>Iteração</InfoTitle>
          <InfoDescription>
            O grupo desenvolveu compartilhou suas ideias, recebeu considerações
            e incluiu melhorias em sua solução.
          </InfoDescription>
        </WrapperInfo>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 0}
              onClick={() =>
                handleEvaluation({ key: 'reqInteraction', option: 0, total: 5 })
              }
            />
            <CellLabel>Solução minimamente compartilhada</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 1}
              onClick={() =>
                handleEvaluation({ key: 'reqInteraction', option: 1, total: 5 })
              }
            />
            <CellLabel>
              Pouquícissimas evidências de melhorias na solução
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 2}
              onClick={() =>
                handleEvaluation({
                  key: 'reqInteraction',
                  option: 2,
                  total: 10
                })
              }
            />
            <CellLabel>Solução moderamente compartilhada</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 3}
              onClick={() =>
                handleEvaluation({
                  key: 'reqInteraction',
                  option: 3,
                  total: 10
                })
              }
            />
            <CellLabel>Algumas evidências de melhorias na solução</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 4}
              onClick={() =>
                handleEvaluation({
                  key: 'reqInteraction',
                  option: 4,
                  total: 15
                })
              }
            />
            <CellLabel>Solução amplamente compartilhada</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 5}
              onClick={() =>
                handleEvaluation({
                  key: 'reqInteraction',
                  option: 5,
                  total: 15
                })
              }
            />
            <CellLabel>Muitas evidências de melhorias na solução</CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqInteraction'].option === 6}
              onClick={() =>
                handleEvaluation({
                  key: 'reqInteraction',
                  option: 6,
                  total: 20
                })
              }
            />
            <CellLabel>Trabalho impecável no critério avaliado</CellLabel>
          </CellInner>
        </Cell>
      </Row>

      <Row>
        <WrapperInfo>
          <InfoTitle>Comunicação</InfoTitle>
          <InfoDescription>
            O grupo usou a criatividade e fez uma ótima apresentação de sua
            solução atual e do impacto sobre os usuários.
          </InfoDescription>
        </WrapperInfo>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 0}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 0,
                  total: 5
                })
              }
            />
            <CellLabel>Apresentação minimamente engajadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 1}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 1,
                  total: 5
                })
              }
            />
            <CellLabel>
              A solução e seu potencial impacto sobre os outros não estão claros
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 2}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 2,
                  total: 10
                })
              }
            />
            <CellLabel>Apresentação relativamente engajadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 3}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 3,
                  total: 10
                })
              }
            />
            <CellLabel>
              A solução e seu potencial impacto sobre os outros estão
              parcialmente claros
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 4}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 4,
                  total: 15
                })
              }
            />
            <CellLabel>Apresentação muito engajadora</CellLabel>
          </CellInner>

          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 5}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 5,
                  total: 15
                })
              }
            />
            <CellLabel>
              A solução e seu potencial impacto sobre os outros estão totalmente
              claros
            </CellLabel>
          </CellInner>
        </Cell>

        <Cell>
          <CellInner>
            <Select
              active={evaluation['reqCommunication'].option === 6}
              onClick={() =>
                handleEvaluation({
                  key: 'reqCommunication',
                  option: 6,
                  total: 20
                })
              }
            />
            <CellLabel>Trabalho impecável no critério avaliado</CellLabel>
          </CellInner>
        </Cell>
      </Row>

      <Row space>
        <WrapperInfo noBorder mobileHidden>
          <Info>{searchParams.schedule}H</Info>
        </WrapperInfo>

        <Cell padding="10px 0" mobileHidden>
          <Info>{searchParams.title}</Info>
        </Cell>

        <Cell padding="0">
          <Button
            label="enviar nota"
            full
            disabled={
              !(
                evaluation.reqCommunication.option !== null &&
                evaluation.reqCreation.option !== null &&
                evaluation.reqIdentify.option !== null &&
                evaluation.reqInteraction.option !== null &&
                evaluation.reqProject.option !== null &&
                session?.user.role === 'judge'
              )
            }
            onClick={handleEvaluationFinish}
          />
        </Cell>
      </Row>
    </Container>
  );
}

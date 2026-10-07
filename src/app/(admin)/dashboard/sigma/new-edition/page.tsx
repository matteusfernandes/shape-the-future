'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { http } from '@/lib/http';
import { Overview } from '@/lib/sigma';
import { normalizeText } from '@/lib/text';

import {
  ActionButton,
  COLORS,
  FieldLabel,
  HeaderButton,
  HeaderContent,
  ItemList,
  ListItem,
  Messages,
  PageStack,
  Panel,
  PanelTitle,
  TextInput,
  TipBox,
  WrapperContent
} from '../../style';

const CONFIRMATION = 'NOVA EDIÇÃO';

type Deleted = {
  projects: number;
  students: number;
  evaluations: number;
  juryVotes: number;
  publicVotes: number;
  judges: number;
  spaces: number;
};

export default function SigmaNewEdition() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [removeJudges, setRemoveJudges] = useState(true);
  const [removeSpaces, setRemoveSpaces] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<Deleted | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await http.get<Overview>('/sigma/overview');
      setOverview(data);
    } catch {
      toast.error('Não foi possível carregar o resumo do evento');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const confirmed = normalizeText(confirmation) === normalizeText(CONFIRMATION);

  const start = async () => {
    if (!confirmed) return;

    setRunning(true);

    try {
      const { data } = await http.post<Deleted>('/sigma/new-edition', {
        confirmation,
        removeJudges,
        removeSpaces
      });
      setResult(data);
      setConfirmation('');
      toast.success('Nova edição iniciada!');
      load();
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>)?.response
        ?.data?.message;
      toast.error(message ?? 'Erro ao iniciar a nova edição');
    } finally {
      setRunning(false);
    }
  };

  const removed = [
    { label: 'Projetos', value: overview?.projects },
    { label: 'Integrantes', value: overview?.students },
    { label: 'Avaliações dos jurados', value: overview?.evaluations },
    { label: 'Votos dos jurados nos finalistas', value: overview?.juryVotes },
    { label: 'Votos populares', value: overview?.publicVotes }
  ];

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Nova Edição</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <TipBox $color={COLORS.danger}>
          <strong>⚠️ Ação irreversível. </strong>
          Os dados abaixo serão apagados definitivamente. Antes de continuar,
          exporte o que precisar em{' '}
          <Link href="/dashboard/reports" style={{ color: COLORS.navy }}>
            <strong>Relatórios</strong>
          </Link>
          .
        </TipBox>

        {result ? (
          <Panel style={{ borderLeft: `4px solid ${COLORS.success}` }}>
            <PanelTitle>✅ Nova edição iniciada</PanelTitle>
            <p>
              Foram removidos {result.projects} projetos, {result.students}{' '}
              integrantes, {result.evaluations} avaliações,{' '}
              {result.juryVotes + result.publicVotes} votos, {result.judges}{' '}
              jurados e {result.spaces} espaços. A votação popular foi fechada.
            </p>
            <p>
              Próximos passos: importe os projetos e depois os usuários pelas
              planilhas no Painel Sigma.
            </p>
          </Panel>
        ) : null}

        <Panel>
          <PanelTitle>🗑️ Sempre removidos</PanelTitle>
          <ItemList>
            {removed.map((item) => (
              <ListItem key={item.label} $accent={COLORS.danger}>
                <span>{item.label}</span>
                <strong>{item.value ?? '–'}</strong>
              </ListItem>
            ))}
          </ItemList>
        </Panel>

        <Panel>
          <PanelTitle>⚙️ Opcionais</PanelTitle>
          <ItemList>
            <ListItem
              as="label"
              $accent={removeJudges ? COLORS.danger : 'transparent'}
              style={{ cursor: 'pointer', justifyContent: 'flex-start' }}
            >
              <input
                type="checkbox"
                checked={removeJudges}
                onChange={(e) => setRemoveJudges(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <div>
                <strong>
                  Remover jurados ({overview?.users.judge ?? '–'})
                </strong>
                <p style={{ fontSize: '0.85em' }}>
                  Recomendado: os jurados costumam mudar a cada edição.
                </p>
              </div>
            </ListItem>
            <ListItem
              as="label"
              $accent={removeSpaces ? COLORS.danger : 'transparent'}
              style={{ cursor: 'pointer', justifyContent: 'flex-start' }}
            >
              <input
                type="checkbox"
                checked={removeSpaces}
                onChange={(e) => setRemoveSpaces(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <div>
                <strong>Remover espaços ({overview?.spaces ?? '–'})</strong>
                <p style={{ fontSize: '0.85em' }}>
                  Mantenha desmarcado se os espaços se repetem. A importação de
                  projetos cria espaços novos automaticamente.
                </p>
              </div>
            </ListItem>
          </ItemList>

          <Messages $kind="success">
            <li>
              🛡️ Usuários admin, staff e sigma são sempre mantidos (
              {(overview?.users.admin ?? 0) +
                (overview?.users.staff ?? 0) +
                (overview?.users.sigma ?? 0)}{' '}
              no total).
            </li>
          </Messages>
        </Panel>

        <Panel style={{ borderLeft: `4px solid ${COLORS.danger}` }}>
          <PanelTitle>Confirmação</PanelTitle>
          <FieldLabel>
            Digite {CONFIRMATION} para confirmar
            <TextInput
              value={confirmation}
              placeholder={CONFIRMATION}
              onChange={(e) => setConfirmation(e.target.value)}
            />
          </FieldLabel>
          <div>
            <ActionButton
              type="button"
              $color={COLORS.danger}
              disabled={!confirmed || running}
              onClick={start}
            >
              <span>{running ? '⏳' : '🗓️'}</span>
              {running ? 'Apagando dados...' : 'Iniciar nova edição'}
            </ActionButton>
          </div>
        </Panel>
      </PageStack>
    </WrapperContent>
  );
}

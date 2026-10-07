'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { EvaluationProgress, percent } from '@/lib/sigma';

import {
  Badge,
  ButtonRow,
  COLORS,
  FieldLabel,
  FilterGrid,
  HeaderButton,
  HeaderContent,
  ItemList,
  ItemMeta,
  ListItem,
  OutlineButton,
  PageStack,
  Panel,
  PanelFooter,
  ProgressFill,
  ProgressTrack,
  SelectInput,
  Stat,
  StatGrid,
  TextInput,
  WrapperContent
} from '../../style';

const REFRESH_MS = 60_000;

type View = 'judges' | 'projects';
type Status = 'all' | 'pending' | 'done';

const statusColor = (done: number, expected: number) => {
  if (!expected) return '#ccc';
  if (done === expected) return COLORS.success;
  return done ? COLORS.warning : COLORS.danger;
};

export default function SigmaProgress() {
  const [data, setData] = useState<EvaluationProgress | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [view, setView] = useState<View>('judges');
  const [status, setStatus] = useState<Status>('pending');
  const [space, setSpace] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await http.get<EvaluationProgress>(
        '/sigma/evaluation-progress'
      );
      setData(data);
      setUpdatedAt(new Date());
    } catch {
      toast.error('Não foi possível carregar o andamento');
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const spaces = useMemo(
    () =>
      Array.from(
        new Set(
          (data?.projects ?? [])
            .map((project) => project.spaceName)
            .filter(Boolean) as string[]
        )
      ).sort(),
    [data]
  );

  const matches = (
    name: string,
    spaceName: string | null,
    done: number,
    expected: number
  ) =>
    name.toLowerCase().includes(search.toLowerCase()) &&
    (space === 'all' || spaceName === space) &&
    (status === 'all' ||
      (status === 'done'
        ? expected > 0 && done === expected
        : done < expected));

  const judges = (data?.judges ?? [])
    .filter((j) => matches(j.username, j.spaceName, j.done, j.expected))
    .sort((a, b) => percent(a.done, a.expected) - percent(b.done, b.expected));

  const projects = (data?.projects ?? [])
    .filter((p) => matches(p.title, p.spaceName, p.done, p.expected))
    .sort((a, b) => percent(a.done, a.expected) - percent(b.done, b.expected));

  const totals = data?.totals;
  const notStarted = (data?.projects ?? []).filter((p) => !p.done).length;
  const listSize = view === 'judges' ? judges.length : projects.length;
  const listTotal =
    view === 'judges' ? data?.judges.length ?? 0 : data?.projects.length ?? 0;

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Andamento das Avaliações</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <Panel>
          <StatGrid>
            <Stat $color={COLORS.success}>
              <strong>
                {percent(totals?.done ?? 0, totals?.expected ?? 0)}%
              </strong>
              <span>
                {totals?.done ?? 0} de {totals?.expected ?? 0} avaliações
              </span>
            </Stat>
            <Stat $color={COLORS.blue}>
              <strong>
                {totals?.judgesDone ?? 0}/{totals?.judges ?? 0}
              </strong>
              <span>jurados concluíram</span>
            </Stat>
            <Stat $color={notStarted ? COLORS.danger : COLORS.success}>
              <strong>{notStarted}</strong>
              <span>projetos sem nenhuma nota</span>
            </Stat>
          </StatGrid>

          <ProgressTrack>
            <ProgressFill
              $value={percent(totals?.done ?? 0, totals?.expected ?? 0)}
            />
          </ProgressTrack>

          <PanelFooter>
            <span>
              🔄 Atualiza a cada minuto
              {updatedAt
                ? ` · última atualização às ${updatedAt.toLocaleTimeString(
                    'pt-BR'
                  )}`
                : ''}
            </span>
            <OutlineButton type="button" onClick={load}>
              Atualizar agora
            </OutlineButton>
          </PanelFooter>
        </Panel>

        <Panel>
          <FilterGrid>
            <FieldLabel>
              Visualizar
              <SelectInput
                value={view}
                onChange={(e) => setView(e.target.value as View)}
              >
                <option value="judges">Por jurado</option>
                <option value="projects">Por projeto</option>
              </SelectInput>
            </FieldLabel>
            <FieldLabel>
              Buscar
              <TextInput
                value={search}
                placeholder={
                  view === 'judges'
                    ? 'Nome do jurado...'
                    : 'Título do projeto...'
                }
                onChange={(e) => setSearch(e.target.value)}
              />
            </FieldLabel>
            <FieldLabel>
              Filtrar por espaço
              <SelectInput
                value={space}
                onChange={(e) => setSpace(e.target.value)}
              >
                <option value="all">Todos os espaços</option>
                {spaces.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>
            <FieldLabel>
              Situação
              <SelectInput
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value="pending">Com pendências</option>
                <option value="done">Concluídos</option>
                <option value="all">Todos</option>
              </SelectInput>
            </FieldLabel>
          </FilterGrid>

          <PanelFooter>
            <span>
              Mostrando <strong>{listSize}</strong> de{' '}
              <strong>{listTotal}</strong>{' '}
              {view === 'judges' ? 'jurados' : 'projetos'}
            </span>
          </PanelFooter>

          <ItemList>
            {view === 'judges'
              ? judges.map((judge) => (
                  <ListItem
                    key={judge.id}
                    $accent={statusColor(judge.done, judge.expected)}
                    style={{ flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <ButtonRow style={{ justifyContent: 'space-between' }}>
                      <strong>{judge.username}</strong>
                      <Badge
                        $color={statusColor(judge.done, judge.expected)}
                        $bg="#fff"
                      >
                        {judge.done}/{judge.expected} avaliados
                      </Badge>
                    </ButtonRow>
                    <ProgressTrack>
                      <ProgressFill
                        $value={percent(judge.done, judge.expected)}
                        $color={statusColor(judge.done, judge.expected)}
                      />
                    </ProgressTrack>
                    <ItemMeta>
                      <span>📍 {judge.spaceName ?? 'Sem espaço'}</span>
                      {judge.pending.length ? (
                        <span>
                          Faltam:{' '}
                          {judge.pending
                            .map((p) => `${p.title} (${p.schedule})`)
                            .join(', ')}
                        </span>
                      ) : judge.expected ? (
                        <span>✅ Todas as avaliações feitas</span>
                      ) : (
                        <span>⚠️ Nenhum projeto no espaço deste jurado</span>
                      )}
                    </ItemMeta>
                  </ListItem>
                ))
              : projects.map((project) => (
                  <ListItem
                    key={project.id}
                    $accent={statusColor(project.done, project.expected)}
                    style={{ flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <ButtonRow style={{ justifyContent: 'space-between' }}>
                      <strong>{project.title}</strong>
                      <Badge
                        $color={statusColor(project.done, project.expected)}
                        $bg="#fff"
                      >
                        {project.done}/{project.expected} avaliações
                      </Badge>
                    </ButtonRow>
                    <ProgressTrack>
                      <ProgressFill
                        $value={percent(project.done, project.expected)}
                        $color={statusColor(project.done, project.expected)}
                      />
                    </ProgressTrack>
                    <ItemMeta>
                      <span>⏰ {project.schedule}</span>
                      <span>📍 {project.spaceName ?? 'Sem espaço'}</span>
                      {project.missingJudges.length ? (
                        <span>
                          Faltam:{' '}
                          {project.missingJudges
                            .map((j) => j.username)
                            .join(', ')}
                        </span>
                      ) : project.expected ? (
                        <span>✅ Avaliado por todos os jurados</span>
                      ) : (
                        <span>⚠️ Nenhum jurado neste espaço</span>
                      )}
                    </ItemMeta>
                  </ListItem>
                ))}

            {data && !listSize ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>
                Nada encontrado com esses filtros.
              </p>
            ) : null}
          </ItemList>
        </Panel>
      </PageStack>
    </WrapperContent>
  );
}

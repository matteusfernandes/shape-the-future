'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
type Space = { id: number; name: string };

import {
  ActionButton,
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
  SelectInput,
  TextInput,
  WrapperContent
} from '../../style';

type Note = {
  reqIdentify: number;
  reqProject: number;
  reqCreation: number;
  reqInteraction: number;
  reqCommunication: number;
};

type Project = {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
  notes: Note[];
};

type RankedProject = Project & { average: number | null; votes: number };

// Cada critério é gravado multiplicado por 10 (0 a 20 = 0 a 2,0); com 5
// critérios a nota vai de 0 a 10. Mesmo cálculo da página de Relatórios.
const noteTotal = (note: Note) =>
  ((note.reqIdentify || 0) +
    (note.reqProject || 0) +
    (note.reqCreation || 0) +
    (note.reqInteraction || 0) +
    (note.reqCommunication || 0)) /
  10;

const average = (notes: Note[]) =>
  notes.length
    ? notes.reduce((sum, note) => sum + noteTotal(note), 0) / notes.length
    : null;

export default function SigmaFinalists() {
  const [projects, setProjects] = useState<RankedProject[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [space, setSpace] = useState('all');
  const [status, setStatus] = useState('all');
  const [topN, setTopN] = useState(1);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [allProjects, allSpaces] = await Promise.all([
        http.get<Project[]>('/projects'),
        http.get<Space[]>('/spaces')
      ]);

      setProjects(
        allProjects.data.map((project) => ({
          ...project,
          average: average(project.notes ?? []),
          votes: project.notes?.length ?? 0
        }))
      );
      setSpaces(allSpaces.data);
    } catch {
      toast.error('Não foi possível carregar os projetos');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const spaceName = useCallback(
    (id: number) => spaces.find((s) => s.id === id)?.name ?? 'Sem espaço',
    [spaces]
  );

  const ranked = useMemo(
    () => [...projects].sort((a, b) => (b.average ?? -1) - (a.average ?? -1)),
    [projects]
  );

  const visible = ranked.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) &&
      (space === 'all' || String(project.spaceId) === space) &&
      (status === 'all' ||
        (status === 'finalist' ? project.finalist : !project.finalist))
  );

  const toggle = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  // Seleciona os N projetos com maior média em cada espaço
  const selectTopPerSpace = () => {
    const bySpace = ranked
      .filter((project) => project.average !== null)
      .reduce<Record<number, RankedProject[]>>((acc, project) => {
        acc[project.spaceId] = [...(acc[project.spaceId] ?? []), project];
        return acc;
      }, {});

    setSelected(
      new Set(
        Object.values(bySpace).flatMap((list) =>
          list.slice(0, Math.max(1, topN)).map((project) => project.id)
        )
      )
    );
  };

  const apply = async (finalist: boolean) => {
    if (!selected.size) return;

    setSaving(true);

    try {
      const { data } = await http.put<{ updated: number }>('/sigma/finalists', {
        projectIds: Array.from(selected),
        finalist
      });

      toast.success(
        `${data.updated} projeto(s) ${
          finalist ? 'marcado(s) como finalista' : 'removido(s) dos finalistas'
        }`
      );
      setSelected(new Set());
      load();
    } catch {
      toast.error('Erro ao atualizar os finalistas');
    } finally {
      setSaving(false);
    }
  };

  const finalists = projects.filter((project) => project.finalist).length;

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Finalistas em Lote</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <Panel>
          <p>
            ⭐ Projetos ordenados pela média das avaliações (0 a 10). Selecione
            vários e marque ou desmarque como finalistas de uma vez. Hoje há{' '}
            <strong>{finalists}</strong> finalista(s).
          </p>

          <ButtonRow>
            <FieldLabel style={{ flexDirection: 'row', alignItems: 'center' }}>
              Selecionar os
              <TextInput
                type="number"
                min={1}
                value={topN}
                style={{ width: '70px' }}
                onChange={(e) => setTopN(Number(e.target.value) || 1)}
              />
              melhores de cada espaço
            </FieldLabel>
            <OutlineButton type="button" onClick={selectTopPerSpace}>
              Selecionar
            </OutlineButton>
            <OutlineButton
              type="button"
              disabled={!selected.size}
              onClick={() => setSelected(new Set())}
            >
              Limpar seleção
            </OutlineButton>
          </ButtonRow>

          <ButtonRow>
            <ActionButton
              type="button"
              $color="#E1A100"
              disabled={!selected.size || saving}
              onClick={() => apply(true)}
            >
              <span>⭐</span>
              Marcar {selected.size || ''} como finalista
            </ActionButton>
            <ActionButton
              type="button"
              $color={COLORS.navy}
              disabled={!selected.size || saving}
              onClick={() => apply(false)}
            >
              Remover {selected.size || ''} dos finalistas
            </ActionButton>
          </ButtonRow>
        </Panel>

        <Panel>
          <FilterGrid>
            <FieldLabel>
              Buscar projeto
              <TextInput
                value={search}
                placeholder="Digite o título..."
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
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>
            <FieldLabel>
              Status finalista
              <SelectInput
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="finalist">Apenas finalistas</option>
                <option value="non-finalist">Não finalistas</option>
              </SelectInput>
            </FieldLabel>
          </FilterGrid>

          <PanelFooter>
            <span>
              Mostrando <strong>{visible.length}</strong> de{' '}
              <strong>{projects.length}</strong> projetos ·{' '}
              <strong>{selected.size}</strong> selecionado(s)
            </span>
            <OutlineButton
              type="button"
              onClick={() =>
                setSelected(new Set(visible.map((project) => project.id)))
              }
            >
              Selecionar visíveis
            </OutlineButton>
          </PanelFooter>

          <ItemList>
            {visible.map((project) => (
              <ListItem
                key={project.id}
                as="label"
                $accent={project.finalist ? '#FFD700' : 'transparent'}
                style={{ cursor: 'pointer', justifyContent: 'flex-start' }}
              >
                <input
                  type="checkbox"
                  checked={selected.has(project.id)}
                  onChange={() => toggle(project.id)}
                  style={{ width: '18px', height: '18px' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <ButtonRow>
                    <strong>{project.title}</strong>
                    {project.finalist && (
                      <Badge $color="#000" $bg="#FFD700">
                        ⭐ FINALISTA
                      </Badge>
                    )}
                  </ButtonRow>
                  <ItemMeta style={{ marginTop: '8px' }}>
                    <span>⏰ {project.schedule}</span>
                    <span>📍 {spaceName(project.spaceId)}</span>
                    <span>📝 {project.votes} avaliação(ões)</span>
                  </ItemMeta>
                </div>
                <Badge
                  $color={project.average === null ? '#666' : COLORS.navy}
                  $bg="#fff"
                  style={{ fontSize: '0.9em' }}
                >
                  {project.average === null
                    ? 'Sem notas'
                    : `${project.average.toFixed(2)} / 10`}
                </Badge>
              </ListItem>
            ))}
          </ItemList>
        </Panel>
      </PageStack>
    </WrapperContent>
  );
}

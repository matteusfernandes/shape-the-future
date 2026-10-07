'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { http } from '@/lib/http';
import {
  ExistingProject,
  ProjectDraft,
  SCHEDULES,
  Space,
  clearDrafts,
  loadDrafts,
  saveDrafts,
  toImportPayload,
  validateDrafts
} from '@/lib/projectImport';

import { HeaderButton, HeaderContent, WrapperContent } from '../../../style';
import {
  ActionButton,
  Actions,
  Card,
  CardGrid,
  CardHeader,
  Field,
  IconButton,
  LinkButton,
  Messages,
  Panel,
  Row,
  StudentLine,
  Summary
} from '../style';

const NEW_SPACE = 'new';

export default function ProjectImportReview() {
  const { push } = useRouter();
  const [drafts, setDrafts] = useState<ProjectDraft[] | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [existing, setExisting] = useState<ExistingProject[]>([]);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDrafts(loadDrafts() ?? []);

    Promise.all([
      http.get<Space[]>('/spaces'),
      http.get<ExistingProject[]>('/projects')
    ])
      .then(([allSpaces, allProjects]) => {
        setSpaces(allSpaces.data);
        setExisting(allProjects.data);
      })
      .catch(() => toast.error('Não foi possível carregar espaços e projetos'));
  }, []);

  const updateDrafts = useCallback((next: ProjectDraft[]) => {
    setDrafts(next);
    saveDrafts(next);
  }, []);

  const updateDraft = useCallback(
    (key: string, changes: Partial<ProjectDraft>) => {
      if (!drafts) return;
      updateDrafts(
        drafts.map((draft) =>
          draft.key === key ? { ...draft, ...changes } : draft
        )
      );
    },
    [drafts, updateDrafts]
  );

  const errors = useMemo(
    () => validateDrafts(drafts ?? [], existing),
    [drafts, existing]
  );

  const invalidCount = Object.values(errors).filter((e) => e.length).length;

  const summary = useMemo(() => {
    const list = drafts ?? [];
    const newSpaces = new Set(
      list
        .filter((draft) => !draft.spaceId && draft.spaceName.trim())
        .map((draft) => draft.spaceName.trim().toUpperCase())
    );

    return {
      projects: list.length,
      students: list.reduce(
        (total, draft) => total + draft.students.filter((s) => s.trim()).length,
        0
      ),
      newSpaces: Array.from(newSpaces)
    };
  }, [drafts]);

  const visibleDrafts = (drafts ?? []).filter(
    (draft) => !onlyErrors || errors[draft.key]?.length
  );

  const handleSubmit = useCallback(async () => {
    if (!drafts?.length || invalidCount) return;

    setSubmitting(true);

    try {
      const { data } = await http.post<{
        projects: number;
        students: number;
        spaces: number;
      }>('/sigma/projects/import', toImportPayload(drafts));

      clearDrafts();
      toast.success(
        `${data.projects} projetos, ${data.students} integrantes e ${data.spaces} novos espaços cadastrados!`
      );
      push('/dashboard/projects');
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>)?.response
        ?.data?.message;
      toast.error(message ?? 'Erro ao cadastrar os projetos');
    } finally {
      setSubmitting(false);
    }
  }, [drafts, invalidCount, push]);

  if (drafts === null) return null;

  if (!drafts.length) {
    return (
      <WrapperContent>
        <HeaderContent>
          <h3>Revisar Importação</h3>
        </HeaderContent>
        <Panel>
          <p>Nenhum projeto para revisar. Envie uma planilha primeiro.</p>
          <Actions>
            <ActionButton
              type="button"
              onClick={() => push('/dashboard/projects/import')}
            >
              Enviar planilha
            </ActionButton>
          </Actions>
        </Panel>
      </WrapperContent>
    );
  }

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Revisar Importação</h3>

        <HeaderButton href="/dashboard/projects/import">
          Enviar outra planilha
        </HeaderButton>
      </HeaderContent>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Panel>
          <Summary>
            <div>
              <strong>{summary.projects}</strong>
              <span>projetos</span>
            </div>
            <div>
              <strong>{summary.students}</strong>
              <span>integrantes</span>
            </div>
            <div>
              <strong>{summary.newSpaces.length}</strong>
              <span>novos espaços</span>
            </div>
            <div>
              <strong style={{ color: invalidCount ? '#dc3545' : '#28a745' }}>
                {invalidCount}
              </strong>
              <span>com pendências</span>
            </div>
          </Summary>

          {summary.newSpaces.length ? (
            <p style={{ fontSize: '0.9em' }}>
              Espaços que serão criados: {summary.newSpaces.join(', ')}
            </p>
          ) : null}

          <Actions>
            <ActionButton
              type="button"
              disabled={!!invalidCount || submitting}
              onClick={handleSubmit}
            >
              {submitting
                ? 'Cadastrando...'
                : `Cadastrar ${summary.projects} projetos`}
            </ActionButton>
            <ActionButton
              type="button"
              variant="secondary"
              onClick={() => setOnlyErrors(!onlyErrors)}
            >
              {onlyErrors ? 'Mostrar todos' : 'Mostrar só com pendências'}
            </ActionButton>
            <ActionButton
              type="button"
              variant="danger"
              onClick={() => {
                if (!confirm('Descartar todos os projetos desta importação?')) {
                  return;
                }
                clearDrafts();
                push('/dashboard/projects/import');
              }}
            >
              Descartar importação
            </ActionButton>
          </Actions>

          {invalidCount ? (
            <p style={{ fontSize: '0.9em', color: '#b02a37' }}>
              Corrija os cards destacados em vermelho para liberar o cadastro.
            </p>
          ) : null}
        </Panel>

        <CardGrid>
          {visibleDrafts.map((draft) => {
            const cardErrors = errors[draft.key] ?? [];

            return (
              <Card key={draft.key} invalid={!!cardErrors.length}>
                <CardHeader>
                  <span>Linha {draft.row} da planilha</span>
                  <IconButton
                    type="button"
                    title="Remover projeto da importação"
                    onClick={() =>
                      updateDrafts(drafts.filter((d) => d.key !== draft.key))
                    }
                  >
                    ✕
                  </IconButton>
                </CardHeader>

                <Field>
                  Título
                  <input
                    value={draft.title}
                    onChange={(e) =>
                      updateDraft(draft.key, { title: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  Subtítulo
                  <input
                    value={draft.subtitle}
                    onChange={(e) =>
                      updateDraft(draft.key, { subtitle: e.target.value })
                    }
                  />
                </Field>

                <Row>
                  <Field>
                    Espaço
                    <select
                      value={draft.spaceId ? String(draft.spaceId) : NEW_SPACE}
                      onChange={(e) =>
                        updateDraft(
                          draft.key,
                          e.target.value === NEW_SPACE
                            ? { spaceId: null }
                            : { spaceId: Number(e.target.value) }
                        )
                      }
                    >
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                      <option value={NEW_SPACE}>+ Novo espaço</option>
                    </select>
                  </Field>

                  <Field>
                    Horário
                    <select
                      value={draft.schedule}
                      onChange={(e) =>
                        updateDraft(draft.key, { schedule: e.target.value })
                      }
                    >
                      <option value="">Selecionar</option>
                      {SCHEDULES.map((schedule) => (
                        <option key={schedule} value={schedule}>
                          {schedule}
                        </option>
                      ))}
                    </select>
                  </Field>
                </Row>

                {!draft.spaceId ? (
                  <Field>
                    Nome do novo espaço
                    <input
                      value={draft.spaceName}
                      placeholder="Ex.: Laboratório 2"
                      onChange={(e) =>
                        updateDraft(draft.key, { spaceName: e.target.value })
                      }
                    />
                  </Field>
                ) : null}

                <Field as="div">
                  Integrantes ({draft.students.filter((s) => s.trim()).length})
                  {draft.students.map((student, index) => (
                    <StudentLine key={index}>
                      <input
                        value={student}
                        placeholder={`Integrante ${index + 1}`}
                        onChange={(e) =>
                          updateDraft(draft.key, {
                            students: draft.students.map((s, i) =>
                              i === index ? e.target.value : s
                            )
                          })
                        }
                      />
                      <IconButton
                        type="button"
                        title="Remover integrante"
                        onClick={() =>
                          updateDraft(draft.key, {
                            students: draft.students.filter(
                              (_, i) => i !== index
                            )
                          })
                        }
                      >
                        ✕
                      </IconButton>
                    </StudentLine>
                  ))}
                  <LinkButton
                    type="button"
                    onClick={() =>
                      updateDraft(draft.key, {
                        students: [...draft.students, '']
                      })
                    }
                  >
                    + Adicionar integrante
                  </LinkButton>
                </Field>

                {draft.warnings.length ? (
                  <Messages kind="warning">
                    {draft.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </Messages>
                ) : null}

                {cardErrors.length ? (
                  <Messages kind="error">
                    {cardErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </Messages>
                ) : null}
              </Card>
            );
          })}
        </CardGrid>
      </div>
    </WrapperContent>
  );
}

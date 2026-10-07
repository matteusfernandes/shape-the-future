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
  projectDrafts,
  toImportPayload,
  validateDrafts
} from '@/lib/projectImport';
import { RemoveIcon } from '@/components/Icons';
import {
  EmptyReview,
  ReviewCard,
  ReviewSummary
} from '@/components/ImportReview';

import {
  CardGrid,
  COLORS,
  FieldLabel,
  HeaderButton,
  HeaderContent,
  IconButton,
  OutlineButton,
  PageStack,
  SelectInput,
  TextInput,
  TipBox,
  WrapperContent
} from '../../../style';

const NEW_SPACE = 'new';

export default function ProjectImportReview() {
  const { push } = useRouter();
  const [drafts, setDrafts] = useState<ProjectDraft[] | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [existing, setExisting] = useState<ExistingProject[]>([]);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDrafts(projectDrafts.load() ?? []);

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
    projectDrafts.save(next);
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
      students: list.reduce(
        (total, draft) => total + draft.students.filter((s) => s.trim()).length,
        0
      ),
      newSpaces: Array.from(newSpaces)
    };
  }, [drafts]);

  const handleSubmit = useCallback(async () => {
    if (!drafts?.length || invalidCount) return;

    setSubmitting(true);

    try {
      const { data } = await http.post<{
        projects: number;
        students: number;
        spaces: number;
      }>('/sigma/projects/import', toImportPayload(drafts));

      projectDrafts.clear();
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

  const goToUpload = () => push('/dashboard/projects/import');

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Revisar Importação de Projetos</h3>

        <HeaderButton href="/dashboard/projects/import">
          Enviar outra planilha
        </HeaderButton>
      </HeaderContent>

      {!drafts.length ? (
        <EmptyReview onBack={goToUpload} />
      ) : (
        <PageStack>
          <ReviewSummary
            stats={[
              { label: 'projetos', value: drafts.length },
              {
                label: 'integrantes',
                value: summary.students,
                color: COLORS.blue
              },
              {
                label: 'novos espaços',
                value: summary.newSpaces.length,
                color: COLORS.purple
              }
            ]}
            invalidCount={invalidCount}
            submitLabel={`Cadastrar ${drafts.length} projetos`}
            submitting={submitting}
            onlyErrors={onlyErrors}
            onToggleErrors={() => setOnlyErrors(!onlyErrors)}
            onSubmit={handleSubmit}
            onDiscard={() => {
              projectDrafts.clear();
              goToUpload();
            }}
          >
            {summary.newSpaces.length ? (
              <TipBox $color={COLORS.purple}>
                <strong>📍 Espaços que serão criados: </strong>
                {summary.newSpaces.join(', ')}
              </TipBox>
            ) : null}
          </ReviewSummary>

          <CardGrid $min={340}>
            {drafts
              .filter((draft) => !onlyErrors || errors[draft.key]?.length)
              .map((draft) => (
                <ReviewCard
                  key={draft.key}
                  line={draft.row}
                  errors={errors[draft.key] ?? []}
                  warnings={draft.warnings}
                  onRemove={() =>
                    updateDrafts(drafts.filter((d) => d.key !== draft.key))
                  }
                >
                  <FieldLabel>
                    Título
                    <TextInput
                      value={draft.title}
                      placeholder="Título do projeto"
                      onChange={(e) =>
                        updateDraft(draft.key, { title: e.target.value })
                      }
                    />
                  </FieldLabel>

                  <FieldLabel>
                    Subtítulo
                    <TextInput
                      value={draft.subtitle}
                      placeholder="Subtítulo do projeto"
                      onChange={(e) =>
                        updateDraft(draft.key, { subtitle: e.target.value })
                      }
                    />
                  </FieldLabel>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px'
                    }}
                  >
                    <FieldLabel>
                      📍 Espaço
                      <SelectInput
                        value={
                          draft.spaceId ? String(draft.spaceId) : NEW_SPACE
                        }
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
                      </SelectInput>
                    </FieldLabel>

                    <FieldLabel>
                      ⏰ Horário
                      <SelectInput
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
                      </SelectInput>
                    </FieldLabel>
                  </div>

                  {!draft.spaceId ? (
                    <FieldLabel>
                      Nome do novo espaço
                      <TextInput
                        value={draft.spaceName}
                        placeholder="Ex.: Laboratório 2"
                        onChange={(e) =>
                          updateDraft(draft.key, { spaceName: e.target.value })
                        }
                      />
                    </FieldLabel>
                  ) : null}

                  <FieldLabel as="div">
                    👥 Integrantes (
                    {draft.students.filter((s) => s.trim()).length})
                    {draft.students.map((student, index) => (
                      <div key={index} style={{ display: 'flex', gap: '6px' }}>
                        <TextInput
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
                          <RemoveIcon />
                        </IconButton>
                      </div>
                    ))}
                    <div>
                      <OutlineButton
                        type="button"
                        onClick={() =>
                          updateDraft(draft.key, {
                            students: [...draft.students, '']
                          })
                        }
                      >
                        + Adicionar integrante
                      </OutlineButton>
                    </div>
                  </FieldLabel>
                </ReviewCard>
              ))}
          </CardGrid>
        </PageStack>
      )}
    </WrapperContent>
  );
}

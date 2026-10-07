'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { http } from '@/lib/http';
import { Space } from '@/lib/spreadsheet';
import {
  ExistingUser,
  UserDraft,
  toUsersPayload,
  userDrafts,
  validateUserDrafts
} from '@/lib/userImport';
import { USER_ROLES, getRoleBadge } from '@/constants';
import {
  EmptyReview,
  ReviewCard,
  ReviewSummary
} from '@/components/ImportReview';

import {
  CardGrid,
  FieldLabel,
  HeaderButton,
  HeaderContent,
  PageStack,
  SelectInput,
  TextInput,
  WrapperContent
} from '../../../../style';

export default function UserImportReview() {
  const { push } = useRouter();
  const [drafts, setDrafts] = useState<UserDraft[] | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [existing, setExisting] = useState<ExistingUser[]>([]);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setDrafts(userDrafts.load() ?? []);

    Promise.all([
      http.get<Space[]>('/spaces'),
      http.get<ExistingUser[]>('/user')
    ])
      .then(([allSpaces, allUsers]) => {
        setSpaces(allSpaces.data);
        setExisting(allUsers.data);
      })
      .catch(() => toast.error('Não foi possível carregar espaços e usuários'));
  }, []);

  const updateDrafts = useCallback((next: UserDraft[]) => {
    setDrafts(next);
    userDrafts.save(next);
  }, []);

  const updateDraft = useCallback(
    (key: string, changes: Partial<UserDraft>) => {
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
    () => validateUserDrafts(drafts ?? [], existing),
    [drafts, existing]
  );

  const invalidCount = Object.values(errors).filter((e) => e.length).length;

  const countRole = (role: string) =>
    (drafts ?? []).filter((draft) => draft.role === role).length;

  const handleSubmit = useCallback(async () => {
    if (!drafts?.length || invalidCount) return;

    setSubmitting(true);

    try {
      const { data } = await http.post<{ users: number }>(
        '/sigma/users/import',
        toUsersPayload(drafts)
      );

      userDrafts.clear();
      toast.success(`${data.users} usuários cadastrados!`);
      push('/dashboard/judget');
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>)?.response
        ?.data?.message;
      toast.error(message ?? 'Erro ao cadastrar os usuários');
    } finally {
      setSubmitting(false);
    }
  }, [drafts, invalidCount, push]);

  if (drafts === null) return null;

  const goToUpload = () => push('/dashboard/sigma/users/import');

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Revisar Importação de Usuários</h3>

        <HeaderButton href="/dashboard/sigma/users/import">
          Enviar outra planilha
        </HeaderButton>
      </HeaderContent>

      {!drafts.length ? (
        <EmptyReview onBack={goToUpload} />
      ) : (
        <PageStack>
          <ReviewSummary
            stats={[
              { label: 'usuários', value: drafts.length },
              ...USER_ROLES.map((role) => ({
                label: role.label.toLowerCase(),
                value: countRole(role.value),
                color: getRoleBadge(role.value).color
              }))
            ]}
            invalidCount={invalidCount}
            submitLabel={`Cadastrar ${drafts.length} usuários`}
            submitting={submitting}
            onlyErrors={onlyErrors}
            onToggleErrors={() => setOnlyErrors(!onlyErrors)}
            onSubmit={handleSubmit}
            onDiscard={() => {
              userDrafts.clear();
              goToUpload();
            }}
          />

          <CardGrid $min={300}>
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
                    Usuário
                    <TextInput
                      value={draft.username}
                      placeholder="Login do usuário"
                      onChange={(e) =>
                        updateDraft(draft.key, { username: e.target.value })
                      }
                    />
                  </FieldLabel>

                  <FieldLabel>
                    Senha
                    <TextInput
                      value={draft.password}
                      placeholder="Senha do usuário"
                      onChange={(e) =>
                        updateDraft(draft.key, { password: e.target.value })
                      }
                    />
                  </FieldLabel>

                  <FieldLabel>
                    Função
                    <SelectInput
                      value={draft.role}
                      style={{
                        borderLeft: `4px solid ${
                          draft.role ? getRoleBadge(draft.role).color : '#ddd'
                        }`
                      }}
                      onChange={(e) =>
                        updateDraft(draft.key, { role: e.target.value })
                      }
                    >
                      <option value="">Selecionar função</option>
                      {USER_ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </SelectInput>
                  </FieldLabel>

                  <FieldLabel>
                    📍 Espaço{draft.role === 'judge' ? '' : ' (opcional)'}
                    <SelectInput
                      value={draft.spaceId ?? ''}
                      onChange={(e) =>
                        updateDraft(draft.key, {
                          spaceId: e.target.value
                            ? Number(e.target.value)
                            : null
                        })
                      }
                    >
                      <option value="">Sem espaço</option>
                      {spaces.map((space) => (
                        <option key={space.id} value={space.id}>
                          {space.name}
                        </option>
                      ))}
                    </SelectInput>
                  </FieldLabel>
                </ReviewCard>
              ))}
          </CardGrid>
        </PageStack>
      )}
    </WrapperContent>
  );
}

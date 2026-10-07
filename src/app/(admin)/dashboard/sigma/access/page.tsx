'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { http } from '@/lib/http';
type Space = { id: number; name: string };
import { CREDENTIAL_PATTERN, USER_ROLES, getRoleBadge } from '@/constants';

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
  ListItem,
  PageStack,
  Panel,
  PanelFooter,
  SelectInput,
  TextInput,
  WrapperContent
} from '../../style';

type User = {
  id: number;
  username: string;
  role: string;
  spaceId: number | null;
};

type Edit = { role: string; spaceId: number | null; password: string };

export default function SigmaAccess() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [edits, setEdits] = useState<Record<number, Edit>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');

  const load = useCallback(async () => {
    try {
      const [allUsers, allSpaces] = await Promise.all([
        http.get<User[]>('/user'),
        http.get<Space[]>('/spaces')
      ]);
      setUsers(allUsers.data);
      setSpaces(allSpaces.data);
      setEdits({});
    } catch {
      toast.error('Não foi possível carregar os usuários');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const editOf = (user: User): Edit =>
    edits[user.id] ?? {
      role: user.role?.toLowerCase(),
      spaceId: user.spaceId,
      password: ''
    };

  const change = (user: User, changes: Partial<Edit>) =>
    setEdits({ ...edits, [user.id]: { ...editOf(user), ...changes } });

  const save = async (user: User) => {
    const edit = editOf(user);

    if (edit.password && !CREDENTIAL_PATTERN.test(edit.password)) {
      toast.error('A senha deve ter de 3 a 30 letras ou números.');
      return;
    }

    if (edit.role === 'judge' && !edit.spaceId) {
      toast.error('Jurado precisa de um espaço.');
      return;
    }

    setSavingId(user.id);

    try {
      await http.put(`/user/${user.id}`, {
        username: user.username,
        role: edit.role,
        ...(edit.role === 'judge' ? { spaceId: edit.spaceId } : {}),
        ...(edit.password ? { password: edit.password } : {})
      });
      toast.success(`${user.username} atualizado com sucesso!`);
      load();
    } catch (error) {
      const message = (error as AxiosError<{ message?: string }>)?.response
        ?.data?.message;
      toast.error(message ?? 'Erro ao atualizar o usuário');
    } finally {
      setSavingId(null);
    }
  };

  const visible = users
    .filter(
      (user) =>
        user.username.toLowerCase().includes(search.toLowerCase()) &&
        (role === 'all' || user.role?.toLowerCase() === role)
    )
    .sort((a, b) => a.username.localeCompare(b.username));

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Gestão de Acesso</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <Panel>
          <p>
            🔐 Altere a função de qualquer usuário e redefina senhas. Deixe a
            senha em branco para mantê-la. Você não pode alterar a sua própria
            função.
          </p>

          <FilterGrid>
            <FieldLabel>
              Buscar usuário
              <TextInput
                value={search}
                placeholder="Digite o nome do usuário..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </FieldLabel>
            <FieldLabel>
              Filtrar por função
              <SelectInput
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="all">Todas as funções</option>
                {USER_ROLES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </FieldLabel>
          </FilterGrid>

          <PanelFooter>
            <span>
              Mostrando <strong>{visible.length}</strong> de{' '}
              <strong>{users.length}</strong> usuários
            </span>
          </PanelFooter>

          <ItemList>
            {visible.map((user) => {
              const edit = editOf(user);
              const badge = getRoleBadge(user.role);
              const isSelf = String(user.id) === String(session?.user?.id);
              const changed =
                edit.role !== user.role?.toLowerCase() ||
                edit.spaceId !== user.spaceId ||
                !!edit.password;

              return (
                <ListItem key={user.id} $accent={badge.color}>
                  <ButtonRow style={{ minWidth: '200px' }}>
                    <strong>{user.username}</strong>
                    <Badge $color={badge.color} $bg={badge.bg}>
                      {badge.label}
                    </Badge>
                    {isSelf && (
                      <Badge $color="#666" $bg="#fff">
                        VOCÊ
                      </Badge>
                    )}
                  </ButtonRow>

                  <ButtonRow style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <SelectInput
                      value={edit.role}
                      disabled={isSelf}
                      style={{ width: '140px' }}
                      onChange={(e) => change(user, { role: e.target.value })}
                    >
                      {USER_ROLES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </SelectInput>

                    {edit.role === 'judge' && (
                      <SelectInput
                        value={edit.spaceId ?? ''}
                        style={{ width: '180px' }}
                        onChange={(e) =>
                          change(user, {
                            spaceId: e.target.value
                              ? Number(e.target.value)
                              : null
                          })
                        }
                      >
                        <option value="">Selecionar espaço</option>
                        {spaces.map((space) => (
                          <option key={space.id} value={space.id}>
                            {space.name}
                          </option>
                        ))}
                      </SelectInput>
                    )}

                    <TextInput
                      type="password"
                      value={edit.password}
                      placeholder="Nova senha"
                      autoComplete="new-password"
                      style={{ width: '160px' }}
                      onChange={(e) =>
                        change(user, { password: e.target.value })
                      }
                    />

                    <ActionButton
                      type="button"
                      $color={COLORS.navy}
                      disabled={!changed || savingId === user.id}
                      onClick={() => save(user)}
                    >
                      {savingId === user.id ? 'Salvando...' : 'Salvar'}
                    </ActionButton>
                  </ButtonRow>
                </ListItem>
              );
            })}
          </ItemList>
        </Panel>
      </PageStack>
    </WrapperContent>
  );
}

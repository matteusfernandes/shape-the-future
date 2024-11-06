'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';

import {
  ContentForm,
  FormLine,
  FormName,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperButtons,
  WrapperContent
} from '../style';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

type Space = { id: number; name: string };

export type Judget = {
  id: number;
  username: string;
  password: string;
  role: string;
  spaceId: number;
  juryVotes: unknown;
};

export default function Judget() {
  const { isAdmin, isStaff } = useRole();
  const [judget, setJudget] = useState<Judget[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const handleJudgeAndSpaces = useCallback(async () => {
    const [user, spaces] = await Promise.all([
      http.get<Judget[]>('/user'),
      http.get<Space[]>('/spaces')
    ]);

    setJudget(user.data as Judget[]);
    setSpaces(spaces.data as Space[]);
  }, []);

  const handleRemoveSpace = useCallback(
    async (user: Judget) => {
      await http.delete(`/user/${user.id}`);
      toast.success(`${user.username} - removido com sucesso!`);
      handleJudgeAndSpaces();
    },
    [handleJudgeAndSpaces]
  );

  useEffect(() => {
    handleJudgeAndSpaces();
  }, [handleJudgeAndSpaces]);

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os {isAdmin ? 'Usuários' : 'Jurados'}</h3>

        <HeaderButton href="/dashboard/judget/create">
          Adicionar {isAdmin ? 'Usuário' : 'Jurado'}
        </HeaderButton>
      </HeaderContent>

      <ContentForm>
        {judget
          .filter((judge) => (isStaff ? judge.role === 'judge' : true))
          ?.map((judge) => {
            const spaceProject = spaces.find((s) => s.id === judge.spaceId);

            return (
              <FormLine key={judge?.id?.toString()}>
                <FormName>
                  <span>
                    {judge?.username}
                    {judge?.role == 'judge'
                      ? ` | JURADO (${spaceProject?.name})`
                      : ` | ${judge?.role.toLocaleUpperCase()}`}
                  </span>
                </FormName>

                <WrapperButtons>
                  <Link href={`/dashboard/judget/${judge?.id}`}>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>

                  {judge?.role == 'judge' && (
                    <Link href={`/dashboard/judget/projects/${judge.id}`}>
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="#0066ff"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </Link>
                  )}

                  {isAdmin && (
                    <RemoveButton onClick={() => handleRemoveSpace(judge)}>
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
                    </RemoveButton>
                  )}
                </WrapperButtons>
              </FormLine>
            );
          })}
      </ContentForm>
    </WrapperContent>
  );
}

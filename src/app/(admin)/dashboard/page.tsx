'use client';

import { useCallback, useEffect, useState } from 'react';
import { http } from '@/lib/http';
import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperButtons,
  WrapperContent
} from './style';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

export type Space = { id: number; name: string };

export default function Dashboard() {
  const { isAdmin } = useRole();
  const [data, setData] = useState<Space[]>([]);

  const handleGetSpace = useCallback(async () => {
    const { data: space } = await http.get<Space[]>('/spaces');
    setData(space);
  }, []);

  const handleRemoveSpace = useCallback(
    async (space: Space) => {
      await http.delete(`/spaces/${space.id}`);
      toast.success(`${space.name} - removido com sucesso!`);
      handleGetSpace();
    },
    [handleGetSpace]
  );

  useEffect(() => {
    handleGetSpace();
  }, [handleGetSpace]);

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Espaços</h3>

        <HeaderButton href="/dashboard/space">Adicionar Espaço</HeaderButton>
      </HeaderContent>

      <ContentForm>
        {data?.map((space) => (
          <FormLine key={space?.id?.toString()}>
            <span style={{ textTransform: 'capitalize' }}>
              {space?.name.toLowerCase()}
            </span>

            <WrapperButtons>
              <Link href={`/dashboard/space/${space?.id}`}>
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

              {isAdmin ? (
                <RemoveButton onClick={() => handleRemoveSpace(space)}>
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
              ) : null}
            </WrapperButtons>
          </FormLine>
        ))}
      </ContentForm>
    </WrapperContent>
  );
}

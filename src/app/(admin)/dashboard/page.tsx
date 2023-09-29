'use client';

import { useCallback, useEffect, useState } from 'react';
import { http } from '@/lib/http';
import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent
} from './style';
import { toast } from 'react-toastify';

type Space = { id: number; name: string };

export default function Dashboard() {
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
            <span>{space?.name}</span>

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
          </FormLine>
        ))}
      </ContentForm>
    </WrapperContent>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Container, Content } from '../style';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';
import { FormTitle } from '../../judget/create/style';
import { Space } from '../../page';

type InputSchema = {
  space: string;
};

const schema = yup
  .object({
    space: yup.string().required('Campo requerido')
  })
  .required();

type SpaceUpdateProps = {
  params: {
    id: number;
  };
};

export default function SpaceUpdate({ params: { id } }: SpaceUpdateProps) {
  const { back } = useRouter();
  const [user, setUser] = useState<Space>();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<InputSchema>({
    resolver: yupResolver(schema)
  });

  const handleSpace = useCallback(
    async (data: InputSchema) => {
      try {
        await http.put(`/spaces/${id}`, {
          name: data.space
        });
        toast.success('Atualizado com sucesso!');
        back();
      } catch {
        toast.error('Erro ao atualizar espaço');
      }
    },
    [back, id]
  );

  const handleSpaceInfo = useCallback(async () => {
    const { data } = await http.get<Space>(`/spaces/${id}`);
    setUser(data);
  }, [id]);

  useEffect(() => {
    handleSpaceInfo();
  }, [handleSpaceInfo]);

  return (
    <>
      <FormTitle>Atualizar Espaço</FormTitle>

      <Container onSubmit={handleSubmit(handleSpace)}>
        <Content>
          <Input
            label="Espaço"
            placeholder="Alterar nome do espaço"
            error={errors.space?.message}
            {...register('space')}
          />

          <Button label="Atualizar" />
        </Content>
      </Container>
    </>
  );
}

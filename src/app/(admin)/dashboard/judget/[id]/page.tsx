'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { Container, Content, FormTitle } from '../create/style';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';
import { Space } from '../../page';
import { AxiosError } from 'axios';
import { useRole } from '@/hooks/useRole';
import { ROLES } from '@/constants';

type Judget = {
  id: number;
  username: string;
  password: string;
  spaceId: number;
  role: string;
};

type InputProps = {
  username: string;
  password?: string;
  spaceId: number;
  role?: string;
};

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string(),
  spaceId: yup.number().required(),
  role: yup.string()
});

type UpdateJudgetProps = {
  params: {
    id: number;
  };
};

export default function UpdateJudget({ params: { id } }: UpdateJudgetProps) {
  const { isAdmin } = useRole();
  const { back } = useRouter();
  const [judget, setJudget] = useState<Judget>();
  const [spaces, setSpaces] = useState<Space[]>();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<InputProps>({
    resolver: yupResolver(schema),
    values: {
      username: judget?.username as string,
      spaceId: judget?.spaceId as number,
      role: judget?.role as string
    }
  });

  const handleDataSubmit = useCallback(
    async (data: InputProps) => {
      try {
        await http.put(`/user/${id}`, {
          ...data
        });
        toast.success('Atualizado com Sucesso');
        back();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data?.message as string);
        }
      }
    },
    [back, id]
  );

  const handleData = useCallback(async () => {
    const [judget, spaces] = await Promise.all([
      http.get(`/user/${id}`),
      http.get('/spaces')
    ]);
    setJudget(judget.data as Judget);
    setSpaces(spaces.data as Space[]);
  }, [id]);

  useEffect(() => {
    handleData();
  }, [handleData]);

  return (
    <>
      <FormTitle>Atualizar Jurado</FormTitle>

      <Container onSubmit={handleSubmit(handleDataSubmit)}>
        <Content>
          <Input
            label="Usuário"
            placeholder="Login do usuário"
            error={errors?.username?.message}
            {...register('username')}
          />

          <Input
            label="Nova senha"
            placeholder="Digite uma nova senha caso queira alterar"
            type="password"
            error={errors?.password?.message}
            {...register('password')}
          />

          {isAdmin ? (
            <Input
              label="Role"
              select
              error={errors?.role?.message}
              {...register('role')}
            >
              <option>Selecionar role</option>
              {Object.keys(ROLES)?.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Input>
          ) : null}

          <Input
            label="Espaço"
            select
            error={errors?.spaceId?.message}
            {...register('spaceId')}
          >
            <option>Selecionar espaço</option>
            {spaces?.map((space) => (
              <option key={space?.id.toString()} value={space?.id}>
                {space?.name}
              </option>
            ))}
          </Input>

          <Button label="Atualizar" />
        </Content>
      </Container>
    </>
  );
}

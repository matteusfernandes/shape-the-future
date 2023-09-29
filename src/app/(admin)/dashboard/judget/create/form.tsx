'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { Container, Content, FormTitle } from './style';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';

type JudgetProps = {
  name: string;
  id: number;
};

type InputProps = {
  username: string;
  password: string;
  spaceId: number;
};

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  spaceId: yup.number().required()
});

export function Form({ data }: { data: JudgetProps[] }) {
  const { push } = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<InputProps>({
    resolver: yupResolver(schema)
  });

  const handleDataSubmit = useCallback(
    async (data: InputProps) => {
      try {
        await http.post('/user', {
          ...data,
          role: 'judge'
        });
        toast.success('Cadastrado com Sucesso');
        push('/dashboard');
      } catch (error) {
        /* empty */
      }
    },
    [push]
  );

  return (
    <>
      <FormTitle>Cadastrar novo Jurado</FormTitle>

      <Container onSubmit={handleSubmit(handleDataSubmit)}>
        <Content>
          <Input
            label="Usuário"
            placeholder="Login do usuário"
            error={errors?.username?.message}
            {...register('username')}
          />
          <Input
            label="Senha"
            placeholder="Senha do usuário"
            type="password"
            error={errors?.password?.message}
            {...register('password')}
          />

          <Input
            label="Espaço"
            select
            error={errors?.spaceId?.message}
            {...register('spaceId')}
          >
            <option>Selecionar espaço</option>
            {data?.map((item) => (
              <option key={item?.id.toString()} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </Input>

          <Button label="Enviar" />
        </Content>
      </Container>
    </>
  );
}

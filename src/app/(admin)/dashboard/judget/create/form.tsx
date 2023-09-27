'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';

import { Container, Content } from './style';

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

  const { handleSubmit, register } = useForm<InputProps>({
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
    <Container onSubmit={handleSubmit(handleDataSubmit)}>
      <Content>
        <Input
          label="Usuário"
          placeholder="Login do usuário"
          {...register('username')}
        />
        <Input
          label="Senha"
          placeholder="Senha do usuário"
          type="password"
          {...register('password')}
        />

        <Input label="Espaço" select {...register('spaceId')}>
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
  );
}

'use client';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

import { Container, Content } from './style';
import { useCallback, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const schema = yup
  .object({
    username: yup.string().required('digite seu usuário'),
    password: yup.string().required('digite sua senha')
  })
  .required();

type Inputs = {
  username: string;
  password: string;
};

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });
  const { push } = useRouter();

  const onSubmit = useCallback(
    async (data: Inputs) => {
      const sign = await signIn('credentials', { ...data, redirect: false });

      if (!_.isEmpty(sign?.error)) {
        toast.error(JSON.parse(sign?.error as string));
        return;
      }

      toast.success('Logado com Sucesso!');
      push('/evaluations');
    },
    [push]
  );

  useEffect(() => {
    if (_.isEmpty(errors)) {
      return;
    }

    Object.keys(errors).map((error) => toast.error(errors[error]?.message));
  }, [errors]);

  return (
    <Container>
      <Content onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Usuário"
          placeholder="Digite seu Usuário"
          {...register('username')}
        />

        <Input
          type="password"
          label="Senha"
          placeholder="Digite sua Senha"
          {...register('password')}
        />

        <Button label="Entrar" />
      </Content>
    </Container>
  );
}

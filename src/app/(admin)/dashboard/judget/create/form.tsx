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
import { useRole } from '@/hooks/useRole';
import { ROLES } from '@/constants';
import _ from 'lodash';

type JudgetProps = {
  name: string;
  id: number;
};

type InputProps = {
  username: string;
  password: string;
  spaceId?: number;
  role?: string;
};

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
  spaceId: yup.number(),
  role: yup.string()
});

export function Form({ data }: { data: JudgetProps[] }) {
  const { back } = useRouter();
  const { isAdmin, isStaff } = useRole();

  const {
    watch,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<InputProps>({
    resolver: yupResolver(schema)
  });

  const handleDataSubmit = useCallback(
    async (data: InputProps) => {
      if (isStaff) {
        _.assign(data, {
          role: 'judge'
        });
      }

      if (_.isEqual(data.role, 'judge') && data.spaceId === 0) {
        toast.error('Juiz precisa de um espaço');
        return;
      }

      if (data.spaceId === 0) {
        delete data.spaceId;
      }

      if (_.isEqual(data.role, 'Selecionar role')) {
        toast.error('Escolha a role do usuário');
        return;
      }

      try {
        await http.post('/user', data);
        toast.success('Cadastrado com Sucesso');
        back();
      } catch (error) {
        toast.error('Error ao cadastrar');
      }
    },
    [back, isStaff]
  );

  return (
    <>
      <FormTitle>Cadastrar novo {isAdmin ? 'Usuário' : 'Jurado'}</FormTitle>

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

          {_.isEqual(watch('role'), 'judge') || isStaff ? (
            <Input
              label="Espaço"
              select
              error={errors?.spaceId?.message}
              {...register('spaceId')}
            >
              <option value={0}>Selecionar espaço</option>
              {data?.map((item) => (
                <option key={item?.id.toString()} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </Input>
          ) : null}

          <Button label="Enviar" />
        </Content>
      </Container>
    </>
  );
}

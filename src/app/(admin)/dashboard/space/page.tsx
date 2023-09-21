'use client';

import { useCallback } from 'react';
import { Container, Content } from './style';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';
import { useRouter } from 'next/navigation';

type InputSchema = {
  space: string;
};

const schema = yup
  .object({
    space: yup.string().required()
  })
  .required();

export default function Space() {
  const { back } = useRouter();
  const { register, handleSubmit } = useForm<InputSchema>({
    resolver: yupResolver(schema)
  });

  const handleSpace = useCallback(
    async (data: InputSchema) => {
      try {
        await http.post('/spaces', {
          name: data.space
        });
        toast.success('Espaço cadastrado com sucesso!');
        back();
      } catch {
        toast.error('Erro ao cadastrar espaço');
      }
    },
    [back]
  );

  return (
    <Container onSubmit={handleSubmit(handleSpace)}>
      <Content>
        <Input
          label="Espaço"
          placeholder="Digite o espaço"
          {...register('space')}
        />

        <Button label="Enviar" />
      </Content>
    </Container>
  );
}

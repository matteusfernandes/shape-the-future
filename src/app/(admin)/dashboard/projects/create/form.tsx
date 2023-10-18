'use client';

import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';

import { Content } from './style';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { FormTitle } from '../../judget/create/style';

type Space = {
  id: string;
  name: string;
};

type FormProjectProps = {
  spaces: Space[];
};

type InputFormProject = {
  title: string;
  subtitle?: string;
  schedule: string;
  spaceId: string;
  students: {
    name: string;
  }[];
};

const schema = yup
  .object({
    title: yup.string().required(),
    subtitle: yup.string(),
    schedule: yup.string().required(),
    spaceId: yup.string().required(),
    students: yup
      .array()
      .of(
        yup.object({
          name: yup.string().required()
        })
      )
      .required()
  })
  .required();

export function FormProject({ spaces }: FormProjectProps) {
  const { push } = useRouter();
  const { register, handleSubmit, control } = useForm<InputFormProject>({
    resolver: yupResolver(schema),
    defaultValues: {
      students: [{ name: '' }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    name: 'students',
    control
  });

  const handleForm = useCallback(
    async (data: InputFormProject) => {
      try {
        await http.post('/projects', data);
        toast.success('Projeto cadastrado com Sucesso!');
        push('/dashboard/projects');
      } catch (error) {
        console.error(error);
      }
    },
    [push]
  );

  const hours = useMemo(() => {
    const hour: number[] = [];

    for (let x = 8; x <= 18; x++) {
      hour.push(x);
    }

    return hour;
  }, []);

  return (
    <>
      <FormTitle>Cadastrar novo projeto</FormTitle>

      <Content onSubmit={handleSubmit(handleForm)}>
        <Input
          label="Título"
          required
          placeholder="Título do Projeto"
          {...register('title')}
        />

        <Input
          label="Sub Título"
          placeholder="Sub Título do Projeto"
          {...register('subtitle')}
        />

        <Input label="Espaço" select required {...register('spaceId')}>
          {spaces.map((item) => (
            <option key={item.id.toString()} value={item.id}>
              {item.name}
            </option>
          ))}
        </Input>

        <Input label="Horário" select required {...register('schedule')}>
          {hours.map((item, index) => (
            <React.Fragment key={index}>
              <option value={`${item}:00`}>{`${item}:00`}</option>
              <option value={`${item}:15`}>{`${item}:15`}</option>
              <option value={`${item}:30`}>{`${item}:30`}</option>
              <option value={`${item}:45`}>{`${item}:45`}</option>
            </React.Fragment>
          ))}
        </Input>

        <FormTitle>Adicionar Integrante{fields.length !== 1 && `s`}</FormTitle>

        {fields.map((student, index) => (
          <Input
            key={index.toString()}
            label={`Integrante ${index + 1}`}
            placeholder="Nome do Integrante"
            addedField={
              fields.length === index + 1 ? () => append({ name: '' }) : null
            }
            removeField={fields.length !== 1 ? () => remove(index) : null}
            {...register(`students.${index}.name`)}
          />
        ))}

        <Button label="Enviar" />
      </Content>
    </>
  );
}

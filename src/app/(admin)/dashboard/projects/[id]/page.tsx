'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { http } from '@/lib/http';

import { Content } from '../create/style';
import { FormTitle } from '../../judget/create/style';
import { Project } from '@/app/timeline/timelines';

type Space = {
  id: string;
  name: string;
};

type InputFormProject = {
  title: string;
  subtitle?: string;
  schedule: string;
  spaceId: number;
  students?: {
    name: string;
  }[];
};

type ProjectUpdateProps = {
  params: {
    id: number;
  };
};

const schema = yup
  .object({
    title: yup.string().required(),
    subtitle: yup.string(),
    schedule: yup.string().required(),
    spaceId: yup.number().required(),
    students: yup.array().of(
      yup.object({
        name: yup.string().required()
      })
    )
  })
  .required();

export default function ProjectUpdate({ params: { id } }: ProjectUpdateProps) {
  const { back } = useRouter();

  const [project, setProject] = useState<Project>();
  const [spaces, setSpaces] = useState<Space[]>();

  const { register, handleSubmit, control } = useForm<InputFormProject>({
    resolver: yupResolver(schema),
    values: {
      title: project?.title as string,
      subtitle: project?.subtitle as string,
      schedule: project?.schedule as string,
      spaceId: project?.spaceId as number,
      students: project?.students
    }
  });
  const { fields, append, remove } = useFieldArray({
    name: 'students',
    control
  });

  const handleForm = useCallback(
    async (data: InputFormProject) => {
      try {
        await http.put(`/projects/${id}`, data);
        toast.success('Atualizado com sucesso!');
        back();
      } catch (error) {
        console.error(error);
      }
    },
    [back, id]
  );

  const handleProjectDetails = useCallback(async () => {
    const [projects, spaces] = await Promise.all([
      http.get(`/projects/${id}`),
      http.get(`/spaces`)
    ]);

    setProject(projects.data as Project);
    setSpaces(spaces.data as Space[]);
  }, [id]);

  const hours = useMemo(() => {
    const hour: number[] = [];

    for (let x = 8; x <= 18; x++) {
      hour.push(x);
    }

    return hour;
  }, []);

  useEffect(() => {
    handleProjectDetails();
  }, [handleProjectDetails]);

  return (
    <>
      <FormTitle>Atualizar projeto</FormTitle>

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
          {spaces?.map((item) => (
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

        <Button label="Atualizar" />
      </Content>
    </>
  );
}

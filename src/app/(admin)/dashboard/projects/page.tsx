'use client';

import { http } from '@/lib/http';

import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent,
  WrapperContentForm
} from '../style';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Project = {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
};

type Space = { id: number; name: string };

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const getProjectsAndSpaces = useCallback(async () => {
    const [allprojects, allSpaces] = await Promise.all([
      http.get<Project[]>('/projects'),
      http.get<Space[]>('/spaces')
    ]);

    setProjects(allprojects.data as Project[]);
    setSpaces(allSpaces.data as Space[]);
  }, []);

  const handleRemoveSpace = useCallback(
    async (project: Project) => {
      await http.delete(`/projects/${project.id}`);
      toast.success(`${project.title} - removido com sucesso!`);
      getProjectsAndSpaces();
    },
    [getProjectsAndSpaces]
  );

  useEffect(() => {
    getProjectsAndSpaces();
  }, [getProjectsAndSpaces]);

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Projetos</h3>

        <HeaderButton href="/dashboard/projects/create">
          Adicionar Projeto
        </HeaderButton>
      </HeaderContent>

      <WrapperContentForm>
        <ContentForm>
          {projects?.map((project) => {
            const spaceProject = spaces.find((s) => s?.id === project?.id);

            return (
              <FormLine key={project?.id?.toString()}>
                <div>
                  <span>{project?.title}</span> |{' '}
                  <span>{project?.subtitle}</span> |
                  <span>{project?.schedule}</span> |{' '}
                  <span>{spaceProject?.name}</span>
                </div>

                <RemoveButton onClick={() => handleRemoveSpace(project)}>
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
            );
          })}
        </ContentForm>
      </WrapperContentForm>
    </WrapperContent>
  );
}

'use client';

import { http } from '@/lib/http';

import {
  ContentForm,
  FormLine,
  FormName,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperButtons,
  WrapperContent,
  WrapperContentForm
} from '../style';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

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
  const { isAdmin } = useRole();
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
                <FormName>
                  <span>
                    {project?.title.toLowerCase()} |{' '}
                    {project?.subtitle.toLowerCase()} |{' '}
                    {project?.schedule.toLowerCase()} |{' '}
                    {spaceProject?.name.toLowerCase()}
                  </span>
                </FormName>

                <WrapperButtons>
                  <Link href={`/dashboard/projects/${project?.id}`}>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>

                  {isAdmin ? (
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
                  ) : null}
                </WrapperButtons>
              </FormLine>
            );
          })}
        </ContentForm>
      </WrapperContentForm>
    </WrapperContent>
  );
}

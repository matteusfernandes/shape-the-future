'use client';

import _ from 'lodash';
import { useEffect, useCallback, useState, useMemo } from 'react';

import { FinalistsItem } from '@/components/FinalistsItem/FinalistsItem';
import { DayBlock } from '@/components/DayBlock';

import { Container, Content } from './style';
import { BLOCK1, BLOCK2 } from '@/constants';
import { http } from '@/lib/http';
import { useSession } from 'next-auth/react';
import { Evaluation } from './evaluations';
import { useRole } from '@/hooks/useRole';
import { LoadingContent } from '../timeline/style';

export default function EvaluationBlocks() {
  const { data: session } = useSession();
  const { isAdmin } = useRole();
  const [block, setBlock] = useState(true);
  const [projects, setProjects] = useState<Evaluation[]>([]);

  const handleProjects = useCallback(async () => {
    const { data } = await http.get('/projects');
    setProjects(data);
  }, []);

  const projectsFiltered = useMemo(() => {
    return projects?.filter((project) =>
      block
        ? BLOCK1.includes(project.schedule)
        : BLOCK2.includes(project.schedule)
    );
  }, [block, projects]);

  useEffect(() => {
    handleProjects();
  }, [handleProjects]);

  return (
    <Container>
      <DayBlock block={block} setBlock={setBlock} />

      {_.isEmpty(projectsFiltered) ? (
        <LoadingContent>Sem projeto para avaliar</LoadingContent>
      ) : null}

      <Content>
        {projectsFiltered
          ?.filter((project) =>
            isAdmin ? true : _.isEqual(project.spaceId, session?.user.spaceId)
          )
          .map((project) => {
            return (
              <FinalistsItem
                key={project.id}
                project={project}
                schedule={project.schedule}
                title={project.title}
                students={project.students}
                horizontal
                evaluation
                group={``}
              />
            );
          })}
      </Content>
    </Container>
  );
}

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
import { useTimeline } from '@/hooks/useTimeline';

export default function EvaluationBlocks() {
  const { data: session } = useSession();
  const { block } = useTimeline();
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
      <DayBlock />

      <Content>
        {projectsFiltered
          ?.filter((project) =>
            _.isEqual(session?.user.role, 'admin')
              ? true
              : project.spaceId === session?.user.spaceId
          )
          .map((project) => (
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
          ))}
      </Content>
    </Container>
  );
}

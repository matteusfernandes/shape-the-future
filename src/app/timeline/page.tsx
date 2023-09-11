'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { DayBlock } from '@/components/DayBlock';
import { TimelineItem } from '@/components/TimelineItem';

import { Container, Content } from './style';

import { http } from '@/lib/http';
import { BLOCK1, BLOCK2 } from '@/constants';
import { Timeline } from './timelines';

export default function Timeline() {
  const [block, setBlock] = useState(true);
  const [spaces, setSpaces] = useState<Timeline[]>([]);

  const handleSpaces = useCallback(async () => {
    const { data } = await http.get<Timeline[]>('/spaces');
    setSpaces(data);
  }, []);

  const spacesFiltered = useMemo(() => {
    return spaces.map((space) => ({
      ...space,
      projects: space.projects.filter((project) =>
        block
          ? BLOCK1.includes(project.schedule)
          : BLOCK2.includes(project.schedule)
      )
    }));
  }, [block, spaces]);

  useEffect(() => {
    handleSpaces();
  }, [handleSpaces]);

  return (
    <Container>
      <Content>
        {spacesFiltered.map((space) => (
          <TimelineItem
            key={space.id}
            spaceId={space.id}
            title={space.name}
            hours={space.projects}
            students={space.students}
          />
        ))}
      </Content>

      <DayBlock setBlock={setBlock} block={block} />
    </Container>
  );
}

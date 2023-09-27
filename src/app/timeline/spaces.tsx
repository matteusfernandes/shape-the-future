'use client';

import { useState, useMemo } from 'react';
import { DayBlock } from '@/components/DayBlock';
import { TimelineItem } from '@/components/TimelineItem';

import { Container, Content } from './style';

import { BLOCK1, BLOCK2 } from '@/constants';
import { Timeline } from './timelines';

type TimelineSpacesProps = {
  spaces: Timeline[];
};

export function TimelineSpaces({ spaces }: TimelineSpacesProps) {
  const [block, setBlock] = useState(true);

  const spacesFiltered = useMemo(() => {
    return spaces?.map((space) => ({
      ...space,
      projects: space?.projects?.filter((project) =>
        block
          ? BLOCK1.includes(project.schedule)
          : BLOCK2.includes(project.schedule)
      )
    }));
  }, [block, spaces]);

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

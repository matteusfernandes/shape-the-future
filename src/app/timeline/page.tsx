'use client';

import { useTimeline } from '@/hooks/useTimeline';

import { TimelineItem } from '@/components/TimelineItem';
import { DayBlock } from '@/components/DayBlock';

import { Container, Content } from './style';

export default function Timeline() {
  const { spacesFiltered } = useTimeline();

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

      <DayBlock />
    </Container>
  );
}

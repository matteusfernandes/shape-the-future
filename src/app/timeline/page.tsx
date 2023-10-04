'use client';

import { useTimeline } from '@/hooks/useTimeline';

import { TimelineItem } from '@/components/TimelineItem';
import { DayBlock } from '@/components/DayBlock';

import { Container, Content, LoadingContent } from './style';
import _ from 'lodash';

export default function Timeline() {
  const { spacesFiltered, block, setBlock } = useTimeline();

  if (_.isEmpty(spacesFiltered)) {
    return <LoadingContent>Carregando...</LoadingContent>;
  }

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

      <DayBlock block={block} setBlock={setBlock} />
    </Container>
  );
}

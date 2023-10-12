'use client';

import { useState, useMemo } from 'react';
import _ from 'lodash';

import { Student } from '@/app/timeline/timelines';

import {
  Container,
  ContentHourSpeak,
  Hour,
  ImageDiv,
  Speaker,
  Title,
  TitleSpeak,
  WrapperContent,
  WrapperHour,
  WrapperTitle
} from './style';

type Hour = {
  id: number;
  title: string;
  schedule: string;
};

type TimelineItemProps = {
  title: string;
  hours: Hour[];
  students: Student[];
  spaceId: number;
};

export function TimelineItem({
  title,
  hours,
  students,
  spaceId
}: TimelineItemProps) {
  const [show, setShow] = useState(false);

  const image = useMemo(() => {
    switch (title?.toLowerCase()) {
      case 'espaço maker':
        return '/images/maker.svg';
      case 'laboratório de biologia (espaço verde)':
        return '/images/biologia.svg';
      case 'laboratório de física':
        return '/images/fisica.svg';
      case 'sala de artes':
        return '/images/atelie.svg';
      case 'techhub':
        return '/images/ciencias.svg';
      default:
        return '/images/biblioteca.svg';
    }
  }, [title]);

  return (
    <Container onClick={() => setShow((prev) => !prev)}>
      <WrapperTitle show={show}>
        <Title show={show}>{title}</Title>
      </WrapperTitle>

      <WrapperContent show={show}>
        {!show ? (
          <ImageDiv image={image} show={show} />
        ) : (
          hours
            ?.sort(
              (a, b) =>
                +a?.schedule.split(':').join('') -
                +b?.schedule.split(':').join('')
            )
            .map((hour) => (
              <ContentHourSpeak key={hour.id.toString()}>
                <WrapperHour>
                  <Hour>{hour.schedule}H</Hour>
                  <TitleSpeak>{hour.title}</TitleSpeak>
                </WrapperHour>

                <Speaker>
                  {students
                    .filter(
                      (student) =>
                        _.isEqual(student.spaceId, spaceId) &&
                        _.isEqual(student.projectId, hour.id)
                    )
                    .map((item) => item.name)
                    .join(' | ')}
                </Speaker>
              </ContentHourSpeak>
            ))
        )}
      </WrapperContent>
    </Container>
  );
}

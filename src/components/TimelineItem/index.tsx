import { useState, useMemo } from 'react';
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
import { Student } from '@/app/timeline/timelines';

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
    switch (title) {
      case 'Espaço Maker':
        return '/images/maker.svg';
      case 'Laboratório de Biologia':
        return '/images/biologia.svg';
      case 'Laboratório de Física':
        return '/images/fisica.svg';
      case 'Ateliê de Artes':
        return '/images/atelie.svg';
      case 'Laboratório de Ciências':
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
            .sort(
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
                        student.spaceId === spaceId &&
                        hour.id === student.projectId
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

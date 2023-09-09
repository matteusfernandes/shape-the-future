import {
  Container,
  ContentHourSpeak,
  Hour,
  Image,
  Speaker,
  Title,
  TitleSpeak,
  WrapperContent,
  WrapperHour,
  WrapperTitle
} from './style';

import { useState, useMemo } from 'react';

import biologia from '../../images/biologia.svg';
import atelie from '../../images/atelie.svg';
import biblioteca from '../../images/biblioteca.svg';
import ciencias from '../../images/ciencias.svg';
import fisica from '../../images/fisica.svg';
import maker from '../../images/maker.svg';

export function TimelineItem({ title, hours, students, spaceId }) {
  const [show, setShow] = useState(false);

  const image = useMemo(() => {
    switch (title) {
      case 'Espaço Maker':
        return maker;
      case 'Laboratório de Biologia':
        return biologia;
      case 'Laboratório de Física':
        return fisica;
      case 'Ateliê de Artes':
        return atelie;
      case 'Laboratório de Ciências':
        return ciencias;
      default:
        return biblioteca;
    }
  }, [title]);

  return (
    <Container onClick={() => setShow((prev) => !prev)}>
      <WrapperTitle show={show}>
        <Title show={show}>{title}</Title>
      </WrapperTitle>

      <WrapperContent show={show}>
        {!show ? (
          <Image image={image} show={show} />
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

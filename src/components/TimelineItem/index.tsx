'use client';

import { useState, useMemo } from 'react';
import _ from 'lodash';

import { Student } from '@/app/timeline/timelines';

import {
  Container,
  ContentHourSpeak,
  Speaker,
  ImageDiv,
  Title,
  TitleSpeak,
  WrapperContent,
  WrapperTitle,
  IconContainer,
  EffectDiv,
  Icon
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
      case 'van gogh 11':
        return '/images/biologia.svg';
      case 'van gogh 12':
        return '/images/fisica.svg';
      case 'pátio infantil':
        return '/images/atelie.svg';
      case 'tech-hub':
        return '/images/ciencias.svg';
      default:
        return '/images/biblioteca.svg';
    }
  }, [title]);

  return (
    <Container onClick={() => setShow((prev) => !prev)}>
      <WrapperTitle>
        <Title>{title}</Title>
      </WrapperTitle>

      <WrapperContent show={show}>
        {!show ? (
          <ImageDiv image={image} show={show}>
            <EffectDiv>
              <IconContainer>
                <Icon>
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    stroke="#fff"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </Icon>
                <span>VER CRONOGRAMA</span>
              </IconContainer>
            </EffectDiv>
          </ImageDiv>
        ) : (
          hours
            ?.sort(
              (a, b) =>
                +a?.schedule.split(':').join('') -
                +b?.schedule.split(':').join('')
            )
            .map((hour) => (
              <ContentHourSpeak key={hour.id.toString()}>
                <TitleSpeak>{hour.title}</TitleSpeak>

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
    //     <Container>
    //       <WrapperTitle>
    //         <Title>{title}</Title>
    //       </WrapperTitle>

    //       <WrapperContent>
    //         {hours
    //             ?.sort(
    //               (a, b) =>
    //                 +a?.schedule.split(':').join('') -
    //                 +b?.schedule.split(':').join('')
    //             )
    //             .map((hour) => (
    //               <ContentHourSpeak key={hour.id.toString()}>
    //                 <WrapperHour>
    //                   <Hour>{hour.schedule}H</Hour>
    //                   <TitleSpeak>{hour.title}</TitleSpeak>
    //                 </WrapperHour>

    //                 <Speaker>
    //                   {students
    //                     .filter(
    //                       (student) =>
    //                         _.isEqual(student.spaceId, spaceId) &&
    //                         _.isEqual(student.projectId, hour.id)
    //                     )
    //                     .map((item) => item.name)
    //                     .join(' | ')}
    //                 </Speaker>
    //               </ContentHourSpeak>
    //             ))}
    //       </WrapperContent>
    //     </Container>
  );
}

'use client';

import { useMemo } from 'react';

import { Button, Container, Content, WrapperButton } from './style';
import { FinalistsItem } from '@/components/FinalistsItem/FinalistsItem';
import { Evaluation, Student } from '@/app/evaluations/evaluations';

type NoteProps = {
  reqCommunication: number;
  reqIdentify: number;
  reqCreation: number;
  reqInteraction: number;
  reqProject: number;
};

type Note = NoteProps & object;

type Project = {
  students: NoteProps & Student[];
  id: number;
  title: string;
  schedule: string;
  notes: Note[];
  nota: Note;
  finalNote: string;
} & Evaluation;

type FormFinalistsVotesProps = {
  projects: Project[];
  vote: boolean;
};

export function FormFinalistsVotes({
  projects,
  vote = false
}: FormFinalistsVotesProps) {
  const notesFinalists = useMemo(() => {
    const notesFinal = projects.map((project) => {
      if (project?.notes?.length !== 0) {
        return {
          ...project,
          nota: project?.notes?.reduce(
            (prev, next) => {
              return {
                ...prev,
                reqCommunication: prev.reqCommunication + next.reqCommunication,
                reqIdentify: prev.reqIdentify + next.reqIdentify,
                reqCreation: prev.reqCreation + next.reqCreation,
                reqInteraction: prev.reqInteraction + next.reqInteraction,
                reqProject: prev.reqProject + next.reqProject
              };
            },
            {
              reqIdentify: 0,
              reqProject: 0,
              reqCreation: 0,
              reqInteraction: 0,
              reqCommunication: 0
            }
          )
        };
      }

      return {
        ...project
      };
    });

    const final = notesFinal.map((projectFinal) => {
      if (projectFinal.nota) {
        const reqCommunication =
          projectFinal.nota.reqCommunication / 10 / projectFinal.notes.length;
        const reqIdentify =
          projectFinal.nota.reqIdentify / 10 / projectFinal.notes.length;
        const reqCreation =
          projectFinal.nota.reqCreation / 10 / projectFinal.notes.length;
        const reqInteraction =
          projectFinal.nota.reqInteraction / 10 / projectFinal.notes.length;
        const reqProject =
          projectFinal.nota.reqProject / 10 / projectFinal.notes.length;

        return {
          ...projectFinal,
          nota: {
            ...projectFinal.nota,
            finalNote: +(
              reqCommunication +
              reqIdentify +
              reqCreation +
              reqInteraction +
              reqProject
            ).toFixed(1)
          }
        };
      }

      return {
        ...projectFinal,
        nota: {
          finalNote: 0
        }
      };
    });

    return final
      .sort((a, b) => a.nota.finalNote * 10 - b.nota.finalNote * 10)
      .reverse();
  }, [projects]);

  return (
    <Container>
      <WrapperButton>
        <Button>Nomear Finalistas</Button>
      </WrapperButton>

      <Content>
        {notesFinalists.map((project) => (
          <FinalistsItem
            key={project.id}
            title={project.title}
            schedule={project.schedule}
            students={project.students}
            project={project}
            notes={project?.nota?.finalNote}
            horizontal
            isVote={vote}
          />
        ))}
      </Content>
    </Container>
  );
}

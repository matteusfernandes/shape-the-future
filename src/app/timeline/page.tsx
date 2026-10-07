'use client';

import { useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';

import { DayBlock } from '@/components/DayBlock';
import { SESSIONS, getSession, sessionRange } from '@/constants';

import { 
  Container, 
  Content, 
  Sidebar,
  MobileDropdown,
  MobileDropdownButton,
  MobileDropdownList,
  MobileDropdownItem,
  MainContent,
  HeaderContent,
  SpaceItem, 
  ProjectList,
  ProjectCard,
  ProjectMeta,
  Chip,
  SessionBanner,
  ProjectTitle,
  ProjectParticipants,
  EmptyState,
  LoadingContent,
  ErrorBox
} from './style';
import _ from 'lodash';

export default function Timeline() {
  const { spaces, spacesFiltered, block, setBlock, error, reload } =
    useTimeline();
  const [spaceId, setSelectedSpaceId] = useState<number | null>(null);
  // Sem escolha do usuário, abre no primeiro espaço
  const selectedSpaceId = spaceId ?? spacesFiltered[0]?.id ?? null;
  const session = getSession(block);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (error) {
    return (
      <LoadingContent>
        <ErrorBox>
          <p>Não foi possível carregar o cronograma.</p>
          <button type="button" onClick={reload}>
            Tentar novamente
          </button>
        </ErrorBox>
      </LoadingContent>
    );
  }

  if (_.isEmpty(spacesFiltered)) {
    return <LoadingContent>Carregando...</LoadingContent>;
  }

  const selectedSpace = spacesFiltered.find(space => space.id === selectedSpaceId);

  // Quantidade de projetos do espaço em cada sessão
  const sessionCounts = Object.fromEntries(
    SESSIONS.map((item) => [
      item.id,
      spaces
        .find((space) => space.id === selectedSpaceId)
        ?.projects?.filter((project) => item.schedules.includes(project.schedule))
        .length ?? 0
    ])
  );

  const handleSpaceSelect = (id: number) => {
    setSelectedSpaceId(id);
    setIsDropdownOpen(false);
  };

  return (
    <Container>
      {/* Dropdown para Mobile */}
      <MobileDropdown>
        <MobileDropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {selectedSpace?.name || 'Selecione um espaço'}
          <span>{isDropdownOpen ? '▲' : '▼'}</span>
        </MobileDropdownButton>
        {isDropdownOpen && (
          <MobileDropdownList>
            {spacesFiltered.map((space) => (
              <MobileDropdownItem
                key={space.id}
                isActive={selectedSpaceId === space.id}
                onClick={() => handleSpaceSelect(space.id)}
              >
                {space.name}
              </MobileDropdownItem>
            ))}
          </MobileDropdownList>
        )}
      </MobileDropdown>

      <Content>
        <Sidebar>
          <h2>Espaços</h2>
          {spacesFiltered.map((space) => (
            <SpaceItem
              key={space.id}
              isActive={selectedSpaceId === space.id}
              onClick={() => setSelectedSpaceId(space.id)}
            >
              {space.name}
            </SpaceItem>
          ))}
        </Sidebar>

        <MainContent>
          {selectedSpace ? (
            <>
              <HeaderContent>
                <h1>{selectedSpace.name}</h1>
                <DayBlock
                  block={block}
                  setBlock={setBlock}
                  counts={sessionCounts}
                  colored
                />
              </HeaderContent>

              <SessionBanner $color={session.color} $soft={session.soft}>
                <strong>Você está vendo a {session.label}</strong>
                <span>
                  das {sessionRange(session.schedules)} ·{' '}
                  {sessionCounts[session.id]} projeto
                  {sessionCounts[session.id] === 1 ? '' : 's'} neste espaço
                </span>
              </SessionBanner>

              {!selectedSpace.projects?.length ? (
                <EmptyState>
                  Nenhum projeto deste espaço na {session.label}.
                </EmptyState>
              ) : null}

              <ProjectList>
                {selectedSpace.projects
                  ?.sort(
                    (a, b) =>
                      +a?.schedule.split(':').join('') -
                      +b?.schedule.split(':').join('')
                  )
                  .map((project) => {
                    const participants = selectedSpace.students
                      .filter(
                        (student) =>
                          _.isEqual(student.spaceId, selectedSpace.id) &&
                          _.isEqual(student.projectId, project.id)
                      )
                      .map((item) => item.name)
                      .join(' | ');

                    return (
                      <ProjectCard key={project.id} $color={session.color}>
                        <ProjectMeta>
                          <Chip $color="#141E53" $bg={session.color}>
                            {project.schedule}
                          </Chip>
                          <Chip $color="#141E53" $bg={session.soft}>
                            {session.label}
                          </Chip>
                        </ProjectMeta>
                        <ProjectTitle>{project.title}</ProjectTitle>
                        {participants && (
                          <ProjectParticipants>{participants}</ProjectParticipants>
                        )}
                      </ProjectCard>
                    );
                  })}
              </ProjectList>
            </>
          ) : (
            <EmptyState>Selecione um espaço para ver os projetos</EmptyState>
          )}
        </MainContent>
      </Content>
    </Container>
  );
}

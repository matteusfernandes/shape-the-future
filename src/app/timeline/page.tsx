'use client';

import { useState } from 'react';
import { useTimeline } from '@/hooks/useTimeline';

import { DayBlock } from '@/components/DayBlock';

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
  ProjectTitle,
  ProjectParticipants,
  EmptyState,
  LoadingContent 
} from './style';
import _ from 'lodash';

export default function Timeline() {
  const { spacesFiltered, block, setBlock } = useTimeline();
  const [selectedSpaceId, setSelectedSpaceId] = useState<number | null>(
    spacesFiltered.length > 0 ? spacesFiltered[0].id : null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (_.isEmpty(spacesFiltered)) {
    return <LoadingContent>Carregando...</LoadingContent>;
  }

  const selectedSpace = spacesFiltered.find(space => space.id === selectedSpaceId);

  const handleSpaceSelect = (spaceId: number) => {
    setSelectedSpaceId(spaceId);
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
                <DayBlock block={block} setBlock={setBlock} />
              </HeaderContent>
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
                      <ProjectCard key={project.id}>
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

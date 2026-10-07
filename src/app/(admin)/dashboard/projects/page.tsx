'use client';

import { http } from '@/lib/http';

import {
  ContentForm,
  FormLine,
  FormName,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperButtons,
  WrapperContent,
  WrapperContentForm
} from '../style';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

type Project = {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
};

type Space = { id: number; name: string };

export default function Projects() {
  const { isAdmin, isSigma } = useRole();
  const [projects, setProjects] = useState<Project[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');
  const [finalistFilter, setFinalistFilter] = useState<string>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('all');

  const getProjectsAndSpaces = useCallback(async () => {
    const [allprojects, allSpaces] = await Promise.all([
      http.get<Project[]>('/projects'),
      http.get<Space[]>('/spaces')
    ]);

    setProjects(allprojects.data as Project[]);
    setSpaces(allSpaces.data as Space[]);
  }, []);

  const handleRemoveSpace = useCallback(
    async (project: Project) => {
      await http.delete(`/projects/${project.id}`);
      toast.success(`${project.title} - removido com sucesso!`);
      getProjectsAndSpaces();
    },
    [getProjectsAndSpaces]
  );

  useEffect(() => {
    getProjectsAndSpaces();
  }, [getProjectsAndSpaces]);

  // Obter horários únicos dos projetos
  const uniqueSchedules = Array.from(new Set(projects.map(p => p.schedule))).sort();

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpace = selectedSpace === 'all' || project.spaceId.toString() === selectedSpace;
    
    const matchesFinalist = 
      finalistFilter === 'all' ||
      (finalistFilter === 'finalist' && project.finalist) ||
      (finalistFilter === 'non-finalist' && !project.finalist);

    const matchesSchedule = selectedSchedule === 'all' || project.schedule === selectedSchedule;

    return matchesSearch && matchesSpace && matchesFinalist && matchesSchedule;
  });

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Projetos</h3>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isSigma && (
            <HeaderButton href="/dashboard/projects/import">
              Importar Planilha
            </HeaderButton>
          )}
          <HeaderButton href="/dashboard/projects/create">
            Adicionar Projeto
          </HeaderButton>
        </div>
      </HeaderContent>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '16px' 
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#141E53', 
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Buscar projeto
            </label>
            <input
              type="text"
              placeholder="Digite o título ou subtítulo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#141E53', 
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Filtrar por espaço
            </label>
            <select
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Todos os espaços</option>
              {spaces.map((space) => (
                <option key={space.id} value={space.id.toString()}>
                  {space.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#141E53', 
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Status finalista
            </label>
            <select
              value={finalistFilter}
              onChange={(e) => setFinalistFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Todos</option>
              <option value="finalist">Apenas finalistas</option>
              <option value="non-finalist">Não finalistas</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#141E53', 
              fontWeight: '500',
              fontSize: '0.9em'
            }}>
              Filtrar por horário
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Todos os horários</option>
              {uniqueSchedules.map((schedule) => (
                <option key={schedule} value={schedule}>
                  {schedule}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid #eee',
          fontSize: '0.9em',
          color: '#666'
        }}>
          <span>
            Mostrando <strong>{filteredProjects.length}</strong> de <strong>{projects.length}</strong> projetos
          </span>
          {(searchTerm || selectedSpace !== 'all' || finalistFilter !== 'all' || selectedSchedule !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpace('all');
                setFinalistFilter('all');
                setSelectedSchedule('all');
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: '#141E53',
                border: '1px solid #141E53',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9em',
                fontWeight: '500'
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <WrapperContentForm>
        <ContentForm style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredProjects?.map((project) => {
            const spaceProject = spaces.find((s) => s?.id === project?.spaceId);

            return (
              <FormLine 
                key={project?.id?.toString()}
                style={{
                  padding: '50px 20px',
                  backgroundColor: '#f8f9fa',
                  marginBottom: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              >
                <FormName style={{ flex: 1, minWidth: 0, paddingRight: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#141E53', fontSize: '1.05em' }}>
                        {project?.title}
                      </strong>
                      {project?.finalist && (
                        <span style={{
                          backgroundColor: '#FFD700',
                          color: '#000',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.75em',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          ⭐ FINALISTA
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#555', fontSize: '0.95em' }}>
                      {project?.subtitle}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.9em', color: '#666', flexWrap: 'wrap' }}>
                      <span>⏰ {project?.schedule}</span>
                      <span>📍 {spaceProject?.name || 'Sem espaço'}</span>
                    </div>
                  </div>
                </FormName>

                <WrapperButtons style={{ flexShrink: 0 }}>
                  <Link href={`/dashboard/projects/${project?.id}`}>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </Link>

                  {isAdmin ? (
                    <RemoveButton onClick={() => handleRemoveSpace(project)}>
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="red"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </RemoveButton>
                  ) : null}
                </WrapperButtons>
              </FormLine>
            );
          })}
        </ContentForm>
      </WrapperContentForm>
    </WrapperContent>
  );
}

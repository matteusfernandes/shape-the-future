'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';

import {
  ContentForm,
  FormLine,
  FormName,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperButtons,
  WrapperContent
} from '../style';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

type Space = { id: number; name: string };

export type Judget = {
  id: number;
  username: string;
  password: string;
  role: string;
  spaceId: number;
  juryVotes: unknown;
};

export default function Judget() {
  const { isAdmin, isStaff } = useRole();
  const [judget, setJudget] = useState<Judget[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSpace, setSelectedSpace] = useState<string>('all');

  const handleJudgeAndSpaces = useCallback(async () => {
    const [user, spaces] = await Promise.all([
      http.get<Judget[]>('/user'),
      http.get<Space[]>('/spaces')
    ]);

    setJudget(user.data as Judget[]);
    setSpaces(spaces.data as Space[]);
  }, []);

  const handleRemoveSpace = useCallback(
    async (user: Judget) => {
      await http.delete(`/user/${user.id}`);
      toast.success(`${user.username} - removido com sucesso!`);
      handleJudgeAndSpaces();
    },
    [handleJudgeAndSpaces]
  );

  useEffect(() => {
    handleJudgeAndSpaces();
  }, [handleJudgeAndSpaces]);

  const filteredJudget = judget
    .filter((judge) => (isStaff ? judge.role === 'judge' : true))
    .filter((judge) => {
      const matchesSearch = judge.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || judge.role === selectedRole;
      const matchesSpace = selectedSpace === 'all' || judge.spaceId?.toString() === selectedSpace;

      return matchesSearch && matchesRole && matchesSpace;
    });

  const getRoleBadge = (role: string) => {
    const roles: Record<string, { label: string; color: string; bg: string }> = {
      admin: { label: 'ADMIN', color: '#dc3545', bg: '#ffe6e9' },
      staff: { label: 'STAFF', color: '#0066ff', bg: '#e6f2ff' },
      judge: { label: 'JURADO', color: '#28a745', bg: '#e6f7ea' }
    };
    
    return roles[role] || { label: role.toUpperCase(), color: '#666', bg: '#f0f0f0' };
  };

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os {isAdmin ? 'Usuários' : 'Jurados'}</h3>

        <HeaderButton href="/dashboard/judget/create">
          Adicionar {isAdmin ? 'Usuário' : 'Jurado'}
        </HeaderButton>
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
              Buscar usuário
            </label>
            <input
              type="text"
              placeholder="Digite o nome do usuário..."
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

          {isAdmin && (
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: '#141E53', 
                fontWeight: '500',
                fontSize: '0.9em'
              }}>
                Filtrar por função
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
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
                <option value="all">Todas as funções</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="judge">Jurado</option>
              </select>
            </div>
          )}

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
            Mostrando <strong>{filteredJudget.length}</strong> de <strong>{judget.filter((j) => isStaff ? j.role === 'judge' : true).length}</strong> usuários
          </span>
          {(searchTerm || selectedRole !== 'all' || selectedSpace !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRole('all');
                setSelectedSpace('all');
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

      <ContentForm style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredJudget?.map((judge) => {
            const spaceProject = spaces.find((s) => s.id === judge.spaceId);
            const roleBadge = getRoleBadge(judge.role);

            return (
              <FormLine 
                key={judge?.id?.toString()}
                style={{
                  padding: '30px 20px',
                  backgroundColor: '#f8f9fa',
                  marginBottom: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box',
                  width: '100%',
                  borderLeft: `4px solid ${roleBadge.color}`
                }}
              >
                <FormName style={{ flex: 1, minWidth: 0, paddingRight: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#141E53', fontSize: '1.1em' }}>
                        {judge?.username}
                      </strong>
                      <span style={{
                        backgroundColor: roleBadge.bg,
                        color: roleBadge.color,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.75em',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {roleBadge.label}
                      </span>
                    </div>
                    {judge?.role === 'judge' && spaceProject && (
                      <div style={{ color: '#666', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📍 <span>{spaceProject.name}</span>
                      </div>
                    )}
                  </div>
                </FormName>

                <WrapperButtons style={{ flexShrink: 0, display: 'flex', gap: '8px' }}>
                  <Link 
                    href={`/dashboard/judget/${judge?.id}`}
                    title="Editar usuário"
                  >
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

                  {judge?.role == 'judge' && (
                    <Link 
                      href={`/dashboard/judget/projects/${judge.id}`}
                      title="Ver projetos avaliados"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="#0066ff"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </Link>
                  )}

                  {isAdmin && (
                    <RemoveButton 
                      onClick={() => handleRemoveSpace(judge)}
                      title="Remover usuário"
                    >
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
                  )}
                </WrapperButtons>
              </FormLine>
            );
          })}
      </ContentForm>
    </WrapperContent>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
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
} from './style';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useRole } from '@/hooks/useRole';

export type Space = { id: number; name: string };

export default function Dashboard() {
  const { isAdmin } = useRole();
  const [data, setData] = useState<Space[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGetSpace = useCallback(async () => {
    const { data: space } = await http.get<Space[]>('/spaces');
    setData(space);
  }, []);

  const handleRemoveSpace = useCallback(
    async (space: Space) => {
      await http.delete(`/spaces/${space.id}`);
      toast.success(`${space.name} - removido com sucesso!`);
      handleGetSpace();
    },
    [handleGetSpace]
  );

  useEffect(() => {
    handleGetSpace();
  }, [handleGetSpace]);

  const filteredSpaces = data.filter((space) =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSpaceColor = (index: number) => {
    const colors = [
      { border: '#FF6B6B', bg: '#FFE6E6' },
      { border: '#4ECDC4', bg: '#E6F7F6' },
      { border: '#45B7D1', bg: '#E6F4F8' },
      { border: '#FFA07A', bg: '#FFEDE6' },
      { border: '#98D8C8', bg: '#E9F7F4' },
      { border: '#6C5CE7', bg: '#EFEDFF' },
      { border: '#FDCB6E', bg: '#FFF5E1' },
      { border: '#E17055', bg: '#FFE9E4' }
    ];
    return colors[index % colors.length];
  };

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Espaços</h3>

        <HeaderButton href="/dashboard/space">Adicionar Espaço</HeaderButton>
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
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#141E53', 
            fontWeight: '500',
            fontSize: '0.9em'
          }}>
            Buscar espaço
          </label>
          <input
            type="text"
            placeholder="Digite o nome do espaço..."
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
            Mostrando <strong>{filteredSpaces.length}</strong> de <strong>{data.length}</strong> espaços
          </span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
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
              Limpar busca
            </button>
          )}
        </div>
      </div>

      <ContentForm style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '16px',
        padding: '10px'
      }}>
        {filteredSpaces?.map((space, index) => {
          const colors = getSpaceColor(index);
          
          return (
            <FormLine 
              key={space?.id?.toString()}
              style={{
                padding: '24px 20px',
                backgroundColor: colors.bg,
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'stretch',
                boxSizing: 'border-box',
                borderLeft: `4px solid ${colors.border}`,
                borderRadius: '8px',
                minHeight: '120px',
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FormName style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: colors.border,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2em',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}>
                    {space.name.charAt(0).toUpperCase()}
                  </div>
                  <strong style={{ 
                    color: '#141E53', 
                    fontSize: '1.1em',
                    textTransform: 'capitalize',
                    flex: 1
                  }}>
                    {space?.name.toLowerCase()}
                  </strong>
                </div>
              </FormName>

              <WrapperButtons style={{ 
                display: 'flex', 
                gap: '8px',
                justifyContent: 'flex-end',
                paddingTop: '12px',
                borderTop: '1px solid rgba(0,0,0,0.08)'
              }}>
                <Link 
                  href={`/dashboard/space/${space?.id}`}
                  title="Editar espaço"
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85em',
                    color: '#141E53',
                    textDecoration: 'none',
                    border: '1px solid #ddd',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Editar
                </Link>

                {isAdmin ? (
                  <RemoveButton 
                    onClick={() => handleRemoveSpace(space)}
                    title="Remover espaço"
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85em',
                      border: '1px solid #ddd',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffe6e6';
                      e.currentTarget.style.borderColor = '#ff6b6b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.borderColor = '#ddd';
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="red"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Remover
                  </RemoveButton>
                ) : null}
              </WrapperButtons>
            </FormLine>
          );
        })}
      </ContentForm>
    </WrapperContent>
  );
}

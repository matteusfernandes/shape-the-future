'use client';

import { useCallback, useState } from 'react';
import { http } from '@/lib/http';
import { toast } from 'react-toastify';
import { useRole } from '@/hooks/useRole';
import {
  WrapperContent,
  HeaderContent
} from '../style';

type ReportType = 'projects' | 'users' | 'spaces' | 'evaluations' | 'votes';

interface CSVData {
  [key: string]: string | number | boolean;
}

export default function Reports() {
  const { isAdmin } = useRole();
  const [loading, setLoading] = useState<ReportType | null>(null);

  const downloadCSV = (data: CSVData[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('Nenhum dado disponível para exportar');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escapa valores com vírgula ou aspas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateProjectsReport = useCallback(async () => {
    setLoading('projects');
    try {
      const { data } = await http.get('/projects');
      const formattedData = data.map((project: Record<string, unknown>) => ({
        ID: project.id,
        Título: project.title,
        Subtítulo: project.subtitle,
        Horário: project.schedule,
        Finalista: project.finalist ? 'Sim' : 'Não',
        'ID do Espaço': project.spaceId
      }));
      downloadCSV(formattedData, 'relatorio_projetos');
      toast.success('Relatório de projetos gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de projetos');
    } finally {
      setLoading(null);
    }
  }, []);

  const generateUsersReport = useCallback(async () => {
    setLoading('users');
    try {
      const { data } = await http.get('/user');
      const formattedData = data.map((user: Record<string, unknown>) => ({
        ID: user.id,
        Usuário: user.username,
        Função: user.role,
        'ID do Espaço': user.spaceId || 'N/A'
      }));
      downloadCSV(formattedData, 'relatorio_usuarios');
      toast.success('Relatório de usuários gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de usuários');
    } finally {
      setLoading(null);
    }
  }, []);

  const generateSpacesReport = useCallback(async () => {
    setLoading('spaces');
    try {
      const { data } = await http.get('/spaces');
      const formattedData = data.map((space: Record<string, unknown>) => ({
        ID: space.id,
        Nome: space.name
      }));
      downloadCSV(formattedData, 'relatorio_espacos');
      toast.success('Relatório de espaços gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de espaços');
    } finally {
      setLoading(null);
    }
  }, []);

  const generateEvaluationsReport = useCallback(async () => {
    setLoading('evaluations');
    try {
      const { data } = await http.get('/projects');
      const evaluationsData: CSVData[] = [];
      
      data.forEach((project: Record<string, unknown>) => {
        if (project.notes && Array.isArray(project.notes) && project.notes.length > 0) {
          project.notes.forEach((note: Record<string, unknown>) => {
            evaluationsData.push({
              'ID do Projeto': project.id as number,
              'Nome do Projeto': project.title as string,
              Comunicação: note.reqCommunication as number,
              Identificação: note.reqIdentify as number,
              Criação: note.reqCreation as number,
              Interação: note.reqInteraction as number,
              Projeto: note.reqProject as number
            });
          });
        }
      });

      if (evaluationsData.length === 0) {
        toast.warning('Nenhuma avaliação encontrada');
        return;
      }

      downloadCSV(evaluationsData, 'relatorio_avaliacoes');
      toast.success('Relatório de avaliações gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de avaliações');
    } finally {
      setLoading(null);
    }
  }, []);

  const generateVotesReport = useCallback(async () => {
    setLoading('votes');
    try {
      const { data } = await http.get('/vote/judge');
      const votesData: CSVData[] = [];
      
      data.forEach((project: Record<string, unknown>) => {
        const juryVotes = project.juryVotes as unknown[] | undefined;
        votesData.push({
          'ID do Projeto': project.id as number,
          'Nome do Projeto': project.title as string,
          'Total de Votos': juryVotes?.length || 0
        });
      });

      downloadCSV(votesData, 'relatorio_votos_jurados');
      toast.success('Relatório de votos gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório de votos');
    } finally {
      setLoading(null);
    }
  }, []);

  const reports = [
    {
      id: 'projects' as ReportType,
      title: 'Relatório de Projetos',
      description: 'Exporta todos os projetos cadastrados com suas informações',
      icon: '📊',
      color: '#4ECDC4',
      bg: '#E6F7F6',
      action: generateProjectsReport
    },
    {
      id: 'users' as ReportType,
      title: 'Relatório de Usuários',
      description: 'Exporta todos os usuários do sistema (jurados, staff e admins)',
      icon: '👥',
      color: '#6C5CE7',
      bg: '#EFEDFF',
      action: generateUsersReport
    },
    {
      id: 'spaces' as ReportType,
      title: 'Relatório de Espaços',
      description: 'Exporta todos os espaços cadastrados',
      icon: '📍',
      color: '#45B7D1',
      bg: '#E6F4F8',
      action: generateSpacesReport
    },
    {
      id: 'evaluations' as ReportType,
      title: 'Relatório de Avaliações',
      description: 'Exporta todas as notas e avaliações dos projetos',
      icon: '⭐',
      color: '#FDCB6E',
      bg: '#FFF5E1',
      action: generateEvaluationsReport
    },
    {
      id: 'votes' as ReportType,
      title: 'Relatório de Votos',
      description: 'Exporta os votos dos jurados para os projetos finalistas',
      icon: '🗳️',
      color: '#FF6B6B',
      bg: '#FFE6E6',
      action: generateVotesReport
    }
  ];

  if (!isAdmin) {
    return (
      <WrapperContent>
        <HeaderContent>
          <h3>Acesso Negado</h3>
        </HeaderContent>
        <div style={{
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: '#141E53', marginBottom: '16px' }}>Acesso Restrito</h2>
          <p style={{ color: '#666', fontSize: '1.1em' }}>
            Apenas administradores podem acessar a seção de relatórios.
          </p>
        </div>
      </WrapperContent>
    );
  }

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Relatórios do Sistema</h3>
      </HeaderContent>

      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#666', fontSize: '0.95em', lineHeight: '1.6' }}>
          📥 Gere relatórios em formato CSV com os dados do sistema. 
          Os arquivos podem ser abertos no Excel, Google Sheets ou qualquer editor de planilhas.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              backgroundColor: report.bg,
              borderLeft: `4px solid ${report.color}`,
              borderRadius: '8px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                backgroundColor: report.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5em'
              }}>
                {report.icon}
              </div>
              <h4 style={{ 
                color: '#141E53', 
                fontSize: '1.1em',
                margin: 0,
                flex: 1
              }}>
                {report.title}
              </h4>
            </div>

            <p style={{ 
              color: '#666', 
              fontSize: '0.9em',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {report.description}
            </p>

            <button
              onClick={report.action}
              disabled={loading !== null}
              style={{
                padding: '12px 20px',
                backgroundColor: loading === report.id ? '#ccc' : report.color,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95em',
                fontWeight: '600',
                cursor: loading !== null ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (loading === null) {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading === report.id ? (
                <>
                  <span>⏳</span>
                  Gerando...
                </>
              ) : (
                <>
                  <span>📥</span>
                  Baixar CSV
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #0066ff'
      }}>
        <h4 style={{ color: '#141E53', fontSize: '0.95em', marginTop: 0 }}>
          💡 Dica
        </h4>
        <p style={{ color: '#666', fontSize: '0.9em', margin: 0, lineHeight: '1.6' }}>
          Os arquivos CSV são salvos com a data atual no nome. Você pode abri-los em programas como 
          Microsoft Excel, Google Sheets, LibreOffice Calc ou qualquer outro editor de planilhas.
        </p>
      </div>
    </WrapperContent>
  );
}

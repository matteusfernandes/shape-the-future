'use client';

import { useCallback, useState } from 'react';
import { http } from '@/lib/http';
import { toast } from 'react-toastify';
import { useRole } from '@/hooks/useRole';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  WrapperContent,
  HeaderContent
} from '../style';

type ReportType = 'projects' | 'users' | 'spaces' | 'evaluations' | 'votes' | 'detailed';

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

  const generateDetailedReportCSV = useCallback(async () => {
    setLoading('detailed');
    try {
      const { data: projects } = await http.get('/projects');
      
      console.log('Projects data:', projects);
      
      const detailedData: CSVData[] = [];

      if (!projects || projects.length === 0) {
        toast.warning('Nenhum projeto encontrado');
        setLoading(null);
        return;
      }

      projects.forEach((project: Record<string, unknown>) => {
        const students = project.students as Record<string, unknown>[] | undefined;
        const notes = project.notes as Record<string, unknown>[] | undefined;

        console.log(`Projeto: ${project.title}`, {
          hasStudents: !!students,
          studentsCount: students?.length || 0,
          hasNotes: !!notes,
          notesCount: notes?.length || 0
        });

        // Listar alunos do projeto
        const studentNames = students?.map((s: Record<string, unknown>) => s.name as string).join(', ') || 'Sem alunos';

        // Se não tem notas, adicionar linha indicando
        if (!notes || notes.length === 0) {
          detailedData.push({
            'ID do Projeto': project.id as number,
            'Nome do Projeto': project.title as string,
            'Alunos': studentNames,
            'Avaliação Nº': 'N/A',
            'Comunicação (0-2)': 'Sem avaliações',
            'Identificação (0-2)': 'Sem avaliações',
            'Criação (0-2)': 'Sem avaliações',
            'Interação (0-2)': 'Sem avaliações',
            'Projeto (0-2)': 'Sem avaliações',
            'Total (0-10)': 'N/A'
          });
          return;
        }

        // Adicionar cada avaliação (nota de cada jurado)
        notes.forEach((note: Record<string, unknown>, index) => {
          const reqCommunication = ((note.reqCommunication as number) || 0) / 10;
          const reqIdentify = ((note.reqIdentify as number) || 0) / 10;
          const reqCreation = ((note.reqCreation as number) || 0) / 10;
          const reqInteraction = ((note.reqInteraction as number) || 0) / 10;
          const reqProject = ((note.reqProject as number) || 0) / 10;

          const total = reqCommunication + reqIdentify + reqCreation + reqInteraction + reqProject;

          detailedData.push({
            'ID do Projeto': project.id as number,
            'Nome do Projeto': project.title as string,
            'Alunos': studentNames,
            'Avaliação Nº': index + 1,
            'Comunicação (0-2)': reqCommunication,
            'Identificação (0-2)': reqIdentify,
            'Criação (0-2)': reqCreation,
            'Interação (0-2)': reqInteraction,
            'Projeto (0-2)': reqProject,
            'Total (0-10)': total
          });
        });

        // Calcular média final do projeto
        const totalSum = notes.reduce((sum, note: Record<string, unknown>) => {
          return sum + 
            ((note.reqCommunication as number) || 0) +
            ((note.reqIdentify as number) || 0) +
            ((note.reqCreation as number) || 0) +
            ((note.reqInteraction as number) || 0) +
            ((note.reqProject as number) || 0);
        }, 0);

        // Dividir por 10 para converter de escala 0-50 para 0-5, e depois dividir pelo número de notas
        const finalAverage = ((totalSum / 10) / notes.length).toFixed(2);

        detailedData.push({
          'ID do Projeto': project.id as number,
          'Nome do Projeto': project.title as string,
          'Alunos': studentNames,
          'Avaliação Nº': 'MÉDIA FINAL',
          'Comunicação (0-2)': '',
          'Identificação (0-2)': '',
          'Criação (0-2)': '',
          'Interação (0-2)': '',
          'Projeto (0-2)': '',
          'Total (0-10)': finalAverage
        });
      });

      console.log('Detailed data:', detailedData);

      if (detailedData.length === 0) {
        toast.warning('Nenhum dado disponível para exportar');
        setLoading(null);
        return;
      }

      downloadCSV(detailedData, 'relatorio_geral_detalhado');
      toast.success('Relatório detalhado CSV gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório detalhado');
    } finally {
      setLoading(null);
    }
  }, []);

  const generateDetailedReportPDF = useCallback(async () => {
    setLoading('detailed');
    try {
      const { data: projects } = await http.get('/projects');
      
      if (!projects || projects.length === 0) {
        toast.warning('Nenhum projeto encontrado');
        setLoading(null);
        return;
      }

      // Criar PDF em orientação horizontal
      const doc = new jsPDF({
        orientation: 'landscape'
      });
      
      let hasContent = false;

      projects.forEach((project: Record<string, unknown>, projectIndex: number) => {
        const students = project.students as Record<string, unknown>[] | undefined;
        const notes = project.notes as Record<string, unknown>[] | undefined;

        // Adicionar nova página para cada projeto (exceto o primeiro)
        if (projectIndex > 0) {
          doc.addPage();
        }

        let currentY = 20;

        // Cabeçalho do projeto
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(`Projeto: ${project.title as string}`, 14, currentY);
        currentY += 10;

        // Lista de alunos
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const studentNames = students?.map((s: Record<string, unknown>) => s.name as string).join(', ') || 'Sem alunos';
        const studentText = `Alunos: ${studentNames}`;
        
        // Quebrar texto se for muito longo
        const splitStudents = doc.splitTextToSize(studentText, 260);
        doc.text(splitStudents, 14, currentY);
        currentY += splitStudents.length * 5 + 5;

        // Data de geração
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, currentY);
        currentY += 10;

        if (!notes || notes.length === 0) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          doc.text('Sem avaliações registradas', 14, currentY);
          return;
        }

        hasContent = true;

        // Tabela de notas
        const tableData = notes.map((note: Record<string, unknown>, index) => {
          const reqCommunication = ((note.reqCommunication as number) || 0) / 10;
          const reqIdentify = ((note.reqIdentify as number) || 0) / 10;
          const reqCreation = ((note.reqCreation as number) || 0) / 10;
          const reqInteraction = ((note.reqInteraction as number) || 0) / 10;
          const reqProject = ((note.reqProject as number) || 0) / 10;
          
          const total = reqCommunication + reqIdentify + reqCreation + reqInteraction + reqProject;

          return [
            `Jurado ${index + 1}`,
            reqCommunication.toString(),
            reqIdentify.toString(),
            reqCreation.toString(),
            reqInteraction.toString(),
            reqProject.toString(),
            total.toFixed(1)
          ];
        });

        // Calcular média final do projeto
        const totalSum = notes.reduce((sum, note: Record<string, unknown>) => {
          return sum + 
            ((note.reqCommunication as number) || 0) +
            ((note.reqIdentify as number) || 0) +
            ((note.reqCreation as number) || 0) +
            ((note.reqInteraction as number) || 0) +
            ((note.reqProject as number) || 0);
        }, 0);
        
        // Dividir por 10 para converter de escala 0-50 para 0-5, e depois dividir pelo número de notas
        const finalAverage = ((totalSum / 10) / notes.length).toFixed(2);

        tableData.push([
          'MÉDIA FINAL',
          '',
          '',
          '',
          '',
          '',
          finalAverage
        ]);

        autoTable(doc, {
          startY: currentY,
          head: [['Avaliação', 'Comunicação', 'Identificação', 'Criação', 'Interação', 'Projeto', 'Total']],
          body: tableData,
          theme: 'striped',
          styles: { 
            fontSize: 10,
            cellPadding: 4,
            halign: 'center'
          },
          headStyles: { 
            fillColor: [65, 30, 83], 
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 11
          },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40, halign: 'left' },
            1: { cellWidth: 35 },
            2: { cellWidth: 35 },
            3: { cellWidth: 35 },
            4: { cellWidth: 35 },
            5: { cellWidth: 35 },
            6: { fontStyle: 'bold', cellWidth: 35 }
          },
          margin: { left: 14, right: 14 },
          didParseCell: function(data) {
            // Destacar linha de média final
            if (data.row.index === tableData.length - 1) {
              data.cell.styles.fillColor = [241, 196, 15];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fontSize = 11;
            }
          }
        });
      });

      if (!hasContent) {
        toast.warning('Nenhuma avaliação encontrada para gerar o PDF');
        setLoading(null);
        return;
      }

      doc.save(`relatorio_geral_detalhado_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório detalhado PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
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
    },
    {
      id: 'detailed' as ReportType,
      title: 'Relatório Geral Detalhado',
      description: 'Relatório completo com projeto, alunos, notas por jurado e critério, e média final',
      icon: '📋',
      color: '#E17055',
      bg: '#FFE9E4',
      action: generateDetailedReportCSV,
      hasMultipleFormats: true,
      pdfAction: generateDetailedReportPDF
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

            {report.hasMultipleFormats ? (
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
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
                <button
                  onClick={report.pdfAction}
                  disabled={loading !== null}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: loading === report.id ? '#ccc' : '#dc3545',
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
                      <span>📄</span>
                      Baixar PDF
                    </>
                  )}
                </button>
              </div>
            ) : (
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
            )}
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

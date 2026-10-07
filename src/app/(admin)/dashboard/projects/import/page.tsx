'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import {
  Space,
  downloadTemplate,
  parseProjectsFile,
  saveDrafts
} from '@/lib/projectImport';

import { HeaderButton, HeaderContent, WrapperContent } from '../../style';
import { ActionButton, Actions, DropZone, Panel } from './style';

export default function ProjectImport() {
  const { push } = useRouter();
  // null enquanto carrega: sem a lista, todo espaço da planilha viraria "novo"
  const [spaces, setSpaces] = useState<Space[] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    http
      .get<Space[]>('/spaces')
      .then(({ data }) => setSpaces(data))
      .catch(() => toast.error('Não foi possível carregar os espaços'));
  }, []);

  const handleFile = useCallback(
    async (file?: File) => {
      if (!file || !spaces) return;

      setProcessing(true);

      try {
        const drafts = await parseProjectsFile(file, spaces);

        if (!drafts.length) {
          toast.error('Nenhum projeto encontrado na planilha');
          return;
        }

        saveDrafts(drafts);
        push('/dashboard/projects/import/review');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível ler o arquivo'
        );
      } finally {
        setProcessing(false);
      }
    },
    [push, spaces]
  );

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Importar Projetos por Planilha</h3>

        <HeaderButton href="/dashboard/projects">Voltar</HeaderButton>
      </HeaderContent>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Panel>
          <strong>1. Baixe o modelo</strong>
          <p>
            Preencha uma linha por projeto na aba &quot;Projetos&quot;. A aba
            &quot;Espaços&quot; lista os espaços já cadastrados e a aba
            &quot;Instruções&quot; explica cada coluna.
          </p>
          <Actions>
            <ActionButton
              type="button"
              variant="secondary"
              disabled={!spaces}
              onClick={() => spaces && downloadTemplate(spaces)}
            >
              Baixar modelo (.xls)
            </ActionButton>
          </Actions>
        </Panel>

        <Panel>
          <strong>2. Envie a planilha preenchida</strong>
          <DropZone
            active={dragging}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFile(event.dataTransfer.files?.[0]);
            }}
          >
            <span style={{ fontSize: '2em' }}>📄</span>
            <strong>
              {!spaces
                ? 'Carregando espaços...'
                : processing
                ? 'Processando...'
                : 'Clique ou arraste o arquivo aqui'}
            </strong>
            <span style={{ fontSize: '0.85em', color: '#666' }}>
              Formatos aceitos: .xls, .xlsx e .csv
            </span>
            <input
              type="file"
              accept=".xls,.xlsx,.csv"
              disabled={!spaces || processing}
              onChange={(event) => {
                handleFile(event.target.files?.[0]);
                event.target.value = '';
              }}
            />
          </DropZone>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Nada é cadastrado agora: na próxima tela você revisa e edita os
            projetos antes de confirmar.
          </p>
        </Panel>
      </div>
    </WrapperContent>
  );
}

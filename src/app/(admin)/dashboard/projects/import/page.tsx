'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import {
  Space,
  downloadTemplate,
  parseProjectsFile,
  projectDrafts
} from '@/lib/projectImport';
import { SpreadsheetUpload } from '@/components/SpreadsheetUpload';

import {
  HeaderButton,
  HeaderContent,
  PageStack,
  WrapperContent
} from '../../style';

export default function ProjectImport() {
  const { push } = useRouter();
  // null enquanto carrega: sem a lista, todo espaço da planilha viraria "novo"
  const [spaces, setSpaces] = useState<Space[] | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    http
      .get<Space[]>('/spaces')
      .then(({ data }) => setSpaces(data))
      .catch(() => toast.error('Não foi possível carregar os espaços'));
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!spaces) return;

      setProcessing(true);

      try {
        const drafts = await parseProjectsFile(file, spaces);

        if (!drafts.length) {
          toast.error('Nenhum projeto encontrado na planilha');
          return;
        }

        projectDrafts.save(drafts);
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
        <h3>Importar Projetos</h3>

        <HeaderButton href="/dashboard/projects">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <SpreadsheetUpload
          ready={!!spaces}
          processing={processing}
          onDownloadTemplate={() => spaces && downloadTemplate(spaces)}
          onFile={handleFile}
          description={
            <>
              Preencha uma linha por projeto na aba &quot;Projetos&quot;. A aba
              &quot;Espaços&quot; lista os espaços já cadastrados e a aba
              &quot;Instruções&quot; explica cada coluna.
            </>
          }
        />
      </PageStack>
    </WrapperContent>
  );
}

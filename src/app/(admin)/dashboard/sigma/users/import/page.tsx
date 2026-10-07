'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { Space } from '@/lib/spreadsheet';
import {
  downloadUsersTemplate,
  parseUsersFile,
  userDrafts
} from '@/lib/userImport';
import { SpreadsheetUpload } from '@/components/SpreadsheetUpload';

import {
  HeaderButton,
  HeaderContent,
  PageStack,
  WrapperContent
} from '../../../style';

export default function UserImport() {
  const { push } = useRouter();
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
        const drafts = await parseUsersFile(file, spaces);

        if (!drafts.length) {
          toast.error('Nenhum usuário encontrado na planilha');
          return;
        }

        userDrafts.save(drafts);
        push('/dashboard/sigma/users/import/review');
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
        <h3>Importar Usuários</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      <PageStack>
        <SpreadsheetUpload
          ready={!!spaces}
          processing={processing}
          onDownloadTemplate={() => spaces && downloadUsersTemplate(spaces)}
          onFile={handleFile}
          description={
            <>
              Preencha uma linha por usuário na aba &quot;Usuários&quot;.
              Jurados precisam de um espaço: cadastre os projetos (e espaços)
              antes de importar os jurados.
            </>
          }
        />
      </PageStack>
    </WrapperContent>
  );
}

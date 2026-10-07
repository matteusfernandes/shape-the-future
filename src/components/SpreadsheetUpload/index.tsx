'use client';

import { useState } from 'react';

import {
  ActionButton,
  COLORS,
  DropZone,
  Panel,
  PanelTitle,
  TipBox
} from '@/app/(admin)/dashboard/style';

type SpreadsheetUploadProps = {
  description: React.ReactNode;
  ready: boolean;
  processing: boolean;
  onDownloadTemplate: () => void;
  onFile: (file: File) => void;
};

export function SpreadsheetUpload({
  description,
  ready,
  processing,
  onDownloadTemplate,
  onFile
}: SpreadsheetUploadProps) {
  const [dragging, setDragging] = useState(false);
  const disabled = !ready || processing;

  const handle = (file?: File) => {
    if (file && !disabled) onFile(file);
  };

  return (
    <>
      <Panel>
        <PanelTitle>1. Baixe o modelo</PanelTitle>
        <p>{description}</p>
        <div>
          <ActionButton
            type="button"
            $color={COLORS.navy}
            disabled={!ready}
            onClick={onDownloadTemplate}
          >
            <span>📥</span>
            Baixar modelo (.xls)
          </ActionButton>
        </div>
      </Panel>

      <Panel>
        <PanelTitle>2. Envie a planilha preenchida</PanelTitle>
        <DropZone
          $active={dragging}
          $disabled={disabled}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handle(event.dataTransfer.files?.[0]);
          }}
        >
          <div style={{ fontSize: '2em' }}>📄</div>
          <strong>
            {!ready
              ? 'Carregando dados...'
              : processing
              ? 'Processando...'
              : 'Clique ou arraste o arquivo aqui'}
          </strong>
          <span>Formatos aceitos: .xls, .xlsx e .csv</span>
          <input
            type="file"
            accept=".xls,.xlsx,.csv"
            disabled={disabled}
            onChange={(event) => {
              handle(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </DropZone>
      </Panel>

      <TipBox>
        <strong>💡 Dica: </strong>
        nada é cadastrado no envio. Na próxima tela você revisa e edita cada
        item antes de confirmar o cadastro.
      </TipBox>
    </>
  );
}

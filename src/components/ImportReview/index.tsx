'use client';

import styled from 'styled-components';

import { RemoveIcon } from '@/components/Icons';
import {
  ActionButton,
  ButtonRow,
  COLORS,
  IconButton,
  Messages,
  OutlineButton,
  Panel,
  Stat,
  StatGrid
} from '@/app/(admin)/dashboard/style';

type ReviewSummaryProps = {
  stats: { label: string; value: number; color?: string }[];
  invalidCount: number;
  submitLabel: string;
  submitting: boolean;
  onlyErrors: boolean;
  onToggleErrors: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
  children?: React.ReactNode;
};

export function ReviewSummary({
  stats,
  invalidCount,
  submitLabel,
  submitting,
  onlyErrors,
  onToggleErrors,
  onSubmit,
  onDiscard,
  children
}: ReviewSummaryProps) {
  return (
    <Panel>
      <StatGrid>
        {stats.map((stat) => (
          <Stat key={stat.label} $color={stat.color}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </Stat>
        ))}
        <Stat $color={invalidCount ? COLORS.danger : COLORS.success}>
          <strong>{invalidCount}</strong>
          <span>com pendências</span>
        </Stat>
      </StatGrid>

      {children}

      {invalidCount ? (
        <Messages $kind="error">
          <li>
            Corrija os cards destacados em vermelho para liberar o cadastro.
          </li>
        </Messages>
      ) : (
        <Messages $kind="success">
          <li>Tudo certo! Revise os dados e confirme o cadastro.</li>
        </Messages>
      )}

      <ButtonRow style={{ justifyContent: 'space-between' }}>
        <ActionButton
          type="button"
          $color={COLORS.success}
          disabled={!!invalidCount || submitting}
          onClick={onSubmit}
        >
          <span>{submitting ? '⏳' : '✅'}</span>
          {submitting ? 'Cadastrando...' : submitLabel}
        </ActionButton>

        <ButtonRow>
          <OutlineButton type="button" onClick={onToggleErrors}>
            {onlyErrors ? 'Mostrar todos' : 'Mostrar só com pendências'}
          </OutlineButton>
          <OutlineButton
            type="button"
            style={{ color: COLORS.danger, borderColor: COLORS.danger }}
            onClick={() => {
              if (confirm('Descartar todos os itens desta importação?')) {
                onDiscard();
              }
            }}
          >
            Descartar importação
          </OutlineButton>
        </ButtonRow>
      </ButtonRow>
    </Panel>
  );
}

const Card = styled(Panel)<{ $invalid: boolean }>`
  border-left: 4px solid
    ${({ $invalid }) => ($invalid ? COLORS.danger : COLORS.success)};
  gap: 14px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85em;
  color: ${COLORS.muted};
`;

type ReviewCardProps = {
  line: number;
  errors: string[];
  warnings?: string[];
  onRemove: () => void;
  children: React.ReactNode;
};

export function ReviewCard({
  line,
  errors,
  warnings = [],
  onRemove,
  children
}: ReviewCardProps) {
  return (
    <Card $invalid={!!errors.length}>
      <CardTop>
        <span>📄 Linha {line} da planilha</span>
        <IconButton
          type="button"
          title="Remover da importação"
          onClick={onRemove}
        >
          <RemoveIcon />
        </IconButton>
      </CardTop>

      {children}

      {warnings.length ? (
        <Messages $kind="warning">
          {warnings.map((warning) => (
            <li key={warning}>⚠️ {warning}</li>
          ))}
        </Messages>
      ) : null}

      {errors.length ? (
        <Messages $kind="error">
          {errors.map((error) => (
            <li key={error}>• {error}</li>
          ))}
        </Messages>
      ) : null}
    </Card>
  );
}

export function EmptyReview({ onBack }: { onBack: () => void }) {
  return (
    <Panel>
      <p>Nenhum item para revisar. Envie uma planilha primeiro.</p>
      <div>
        <ActionButton type="button" onClick={onBack}>
          Enviar planilha
        </ActionButton>
      </div>
    </Panel>
  );
}

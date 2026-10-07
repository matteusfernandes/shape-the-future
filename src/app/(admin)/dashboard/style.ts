'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const ContainerDashboard = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const MenuDashboard = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  padding: 20px;
  gap: 20px;

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;
    color: #fff;

    &::before {
      border: 1px #f1f1f1 solid;
      border-radius: 7.5px;
      content: '';
      display: inline-block;
      height: 15px;
      width: 15px;
      margin-right: 20px;
    }
  }

  @media (max-width: 960px) {
    display: none;
  }
`;

export const ContentDashboard = styled.div`
  flex: 1;
  padding: 20px;
`;

export const WrapperContent = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: 20px;
  height: 100%;

  h3 {
    font-size: 18px;
    color: #fff;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const HeaderButton = styled(Link)`
  border: none;
  border-radius: 4.5px;
  padding: 10px 20px;
  background: #00c1ce;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4.5px;
  background: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

export const WrapperContentForm = styled.div`
  max-height: 460px;
  overflow-x: auto;
  height: 100%;
`;

export const ContentForm = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: #fff;
  overflow-x: auto;
  height: 100%;
`;

export const FormLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  border-bottom: 1px #f1f1f1 solid;
  padding: 0 20px;
  min-height: 60px;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const FormName = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
  text-transform: capitalize;
  overflow: hidden;
  margin-right: 20px;

  span {
    @media (max-width: 760px) {
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 16px;
    }
  }
`;

export const WrapperButtons = styled.div`
  flex: 'inherit';
  padding: 0;

  display: flex;
  align-items: center;
  gap: 10px;
`;

// ---------------------------------------------------------------------------
// Blocos reutilizáveis: mesmos padrões visuais das páginas de Projetos,
// Usuários e Relatórios (painel branco, filtros, itens #f8f9fa, badges).
// ---------------------------------------------------------------------------

export const COLORS = {
  navy: '#141E53',
  muted: '#666',
  primary: '#00c1ce',
  blue: '#0066ff',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#E1A100',
  purple: '#6f42c1'
};

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  color: ${COLORS.navy};

  p {
    color: ${COLORS.muted};
    font-size: 0.95em;
    line-height: 1.6;
    margin: 0;
  }
`;

export const PanelTitle = styled.h4`
  color: ${COLORS.navy};
  font-size: 1.1em;
  margin: 0;
`;

export const PanelFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 8px;
  border-top: 1px solid #eee;
  font-size: 0.9em;
  color: ${COLORS.muted};
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const FieldLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${COLORS.navy};
  font-weight: 500;
  font-size: 0.9em;
`;

const fieldStyle = `
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-weight: normal;
  color: #1e1e1e;
  background-color: #fff;
  box-sizing: border-box;
`;

export const TextInput = styled.input`
  ${fieldStyle}
`;

export const SelectInput = styled.select`
  ${fieldStyle}
  cursor: pointer;
`;

export const ActionButton = styled.button<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: ${({ $color }) => $color ?? COLORS.primary};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.95em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: scale(1.02);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const OutlineButton = styled.button`
  padding: 6px 12px;
  background-color: transparent;
  color: ${COLORS.navy};
  border: 1px solid ${COLORS.navy};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

export const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: bold;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ListItem = styled.div<{ $accent?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 20px;
  background-color: #f8f9fa;
  border-left: 4px solid ${({ $accent }) => $accent ?? 'transparent'};
  color: ${COLORS.navy};
`;

export const ItemMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.9em;
  color: ${COLORS.muted};
`;

export const CardGrid = styled.div<{ $min?: number }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, ${({ $min }) => $min ?? 320}px), 1fr)
  );
  gap: 20px;
  align-items: start;
`;

// Card no estilo da página de Relatórios
export const ToolCard = styled(Link)<{ $color: string; $bg: string }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: ${({ $bg }) => $bg};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h4 {
    color: ${COLORS.navy};
    font-size: 1.1em;
    margin: 0;
    flex: 1;
  }

  p {
    color: ${COLORS.muted};
    font-size: 0.9em;
    margin: 0;
    line-height: 1.5;
  }
`;

export const IconBox = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: ${({ $color }) => $color};
  font-size: 1.5em;
`;

export const CardHeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
`;

export const Stat = styled.div<{ $color?: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background-color: #f8f9fa;
  border-left: 4px solid ${({ $color }) => $color ?? COLORS.primary};
  border-radius: 6px;

  strong {
    font-size: 1.6em;
    color: ${COLORS.navy};
  }

  span {
    font-size: 0.85em;
    color: ${COLORS.muted};
  }
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $value: number; $color?: string }>`
  width: ${({ $value }) => Math.min(100, Math.max(0, $value))}%;
  height: 100%;
  background-color: ${({ $color }) => $color ?? COLORS.success};
  transition: width 0.3s ease;
`;

export const Messages = styled.ul<{ $kind: 'error' | 'warning' | 'success' }>`
  margin: 0;
  padding: 10px 14px;
  list-style: none;
  border-radius: 6px;
  font-size: 0.85em;
  line-height: 1.5;
  background-color: ${({ $kind }) =>
    ({ error: '#ffe6e9', warning: '#fff5e1', success: '#e6f7ea' })[$kind]};
  color: ${({ $kind }) =>
    ({ error: '#b02a37', warning: '#8a6100', success: '#1e7b34' })[$kind]};
`;

// Caixa de dica no estilo do rodapé da página de Relatórios
export const TipBox = styled.div<{ $color?: string }>`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid ${({ $color }) => $color ?? COLORS.blue};
  color: ${COLORS.muted};
  font-size: 0.9em;
  line-height: 1.6;

  strong {
    color: ${COLORS.navy};
  }
`;

export const DropZone = styled.label<{
  $active?: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  border: 2px dashed ${({ $active }) => ($active ? COLORS.primary : '#ddd')};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? '#e6fafb' : '#f8f9fa')};
  color: ${COLORS.navy};
  text-align: center;
  cursor: ${({ $disabled }) => ($disabled ? 'wait' : 'pointer')};

  span {
    color: ${COLORS.muted};
    font-size: 0.85em;
  }

  input {
    display: none;
  }
`;

export const IconButton = styled.button<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: none;
  color: ${({ $color }) => $color ?? COLORS.danger};
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const PageStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

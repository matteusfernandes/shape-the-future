'use client';

import styled, { css } from 'styled-components';

export const Container = styled.div<{ $colored?: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  ${({ $colored }) =>
    $colored &&
    css`
      gap: 8px;
      padding: 6px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    `}
`;

export const Range = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 0.75em;
  font-weight: 500;
  opacity: 0.85;
`;

type DayButtonProps = { $active?: boolean; $color?: string };

export const DayButton = styled.button<DayButtonProps>`
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  cursor: pointer;
  border: none;
  transition: all ease-in-out 0.2s;

  /* Visual neutro (avaliações): marinho com o ativo em branco */
  ${({ $color, $active, theme }) =>
    !$color &&
    css`
      background-color: ${$active ? theme.COLORS.WHITE[900] : theme.COLORS.BLUE[200]};
      color: ${$active ? theme.COLORS.BLUE[200] : theme.COLORS.WHITE[900]};

      &:hover {
        background-color: ${$active
          ? theme.COLORS.WHITE[900]
          : 'rgba(255, 255, 255, 0.15)'};
      }
    `}

  /* Visual por sessão (cronograma): ativo preenchido com a cor da sessão */
  ${({ $color, $active, theme }) =>
    $color &&
    css`
      font-size: 15px;
      padding: 10px 18px;
      border-radius: 6px;
      border: 2px solid ${$color};
      background-color: ${$active ? $color : '#fff'};
      color: ${$active ? theme.COLORS.BLUE[200] : '#666'};
      box-shadow: ${$active ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none'};

      &:hover {
        background-color: ${$active ? $color : '#f8f9fa'};
      }
    `}
`;

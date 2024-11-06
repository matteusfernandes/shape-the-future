'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

export const DayButton = styled.button<{ active?: boolean }>`
  background-color: ${({ theme }) => theme.COLORS.BLUE[200]};
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  font-size: 18px;
  font-weight: 500;
  padding: 20px;
  cursor: pointer;
  border: none;

  transition: all ease-in-out 0.2s;

  ${({ active, theme }) =>
    active &&
    `
    background-color: ${theme.COLORS.WHITE[900]};
    color: ${theme.COLORS.BLUE[200]};
  `}

  &:hover {
    background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
    color: ${({ theme }) => theme.COLORS.BLUE[200]};
  }
`;

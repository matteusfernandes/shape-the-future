import { HtmlHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export const Container = styled.button<
  {
    full?: boolean;
    borderless?: boolean;
  } & HtmlHTMLAttributes<HTMLButtonElement>
>`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  color: ${({ theme }) => theme.COLORS.BLUE[200]};
  font-size: 14px;
  padding: 10px 30px;
  height: 40px;
  text-transform: uppercase;
  font-weight: 700;
  cursor: pointer;
  transition: all ease-in-out 0.3s;
  border-radius: 4.5px;

  &:disabled {
    cursor: not-allowed;
    background-color: #403d3d;

    &:hover {
      color: ${({ theme }) => theme.COLORS.BLUE[200]};
      background-color: #403d3d;
    }
  }

  ${({ full }) =>
    full &&
    `
    height: 100%;
    width: 100%;
  `};

  &:hover {
    color: ${({ theme }) => theme.COLORS.WHITE[900]};
    background-color: ${({ theme }) => theme.COLORS.BLUE[200]};
  }

  ${({ borderless }) =>
    borderless &&
    css`
      background: ${({ theme }) => theme.COLORS.BLUE[200]};
      color: ${({ theme }) => theme.COLORS.WHITE[900]};

      &:hover {
        background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
        color: ${({ theme }) => theme.COLORS.BLUE[200]};
      }
    `}
`;

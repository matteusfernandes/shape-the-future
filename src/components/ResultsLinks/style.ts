'use client';

import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;

  @media (max-width: 585px) {
    flex-flow: column nowrap;
  }
`;

export const Content = styled.div<{ background: string }>`
  background: ${({ background }) => background && css`url(${background})`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  flex: 1;

  a {
    display: flex;
    justify-content: center;
    flex: 1;
    text-decoration: none;
    height: 100%;
  }

  @media (max-width: 585px) {
    min-height: 250px;
  }

  &:hover {
    opacity: 0.9;
  }
`;

export const Title = styled.h3`
  font-size: 28px;
  text-transform: uppercase;
  color: ${({ theme }) => theme.COLORS.BLUE[200]};
  font-weight: 700;
  max-width: 200px;
  text-align: center;
  margin-top: 100px;
`;

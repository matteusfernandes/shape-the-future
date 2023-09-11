'use client';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  overflow: hidden;
  overflow-x: auto;
  flex: 1;

  @media (max-width: 585px) {
    flex-flow: column nowrap;
    overflow: none;
  }

  & > div:nth-child(1n) {
    background-color: #54737e;
  }

  & > div:nth-child(2n) {
    background-color: #707dbb;
  }

  & > div:nth-child(3n) {
    background-color: #ec72a1;
  }

  & > div:nth-child(4n) {
    background-color: #f0af83;
  }

  & > div:nth-child(5n) {
    background-color: #55b47a;
  }
`;

export const ContainerEmpty = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Info = styled.h1`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  font-size: 32px;
  font-weight: 700;
`;

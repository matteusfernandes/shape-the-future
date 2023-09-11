'use client';

import styled from 'styled-components';

export const Container = styled.div`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  display: flex;
  flex-flow: column nowrap;
  margin: 80px auto;
  max-width: 1210px;
  min-height: 670px;

  @media (max-width: 585px) {
    margin: 0 auto;
  }
`;

export const Header = styled.div`
  display: flex;
  padding: 10px;
  height: 30px;
  width: 100%;
`;

export const Options = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  border-radius: 7px;
  height: 14px;
  width: 14px;
  margin-right: 8px;
`;

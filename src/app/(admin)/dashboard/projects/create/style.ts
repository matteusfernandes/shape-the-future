'use client';

import styled from 'styled-components';

export const Container = styled.form`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  flex: 1;
  padding: 20px 0;
`;

export const WrapperContent = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 585px) {
    flex-flow: column nowrap;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  flex: 1;
`;

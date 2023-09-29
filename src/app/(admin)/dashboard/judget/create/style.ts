'use client';

import styled from 'styled-components';

export const Container = styled.form`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;

export const FormTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  margin: 20px 0;
`;

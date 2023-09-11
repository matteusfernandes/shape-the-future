import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  overflow: hidden;
  overflow-x: auto;

  @media (max-width: 460px) {
    flex-flow: column nowrap;
    overflow: none;
  }
`;

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

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 480px;
  font-size: 18px;
  color: #666;
`;

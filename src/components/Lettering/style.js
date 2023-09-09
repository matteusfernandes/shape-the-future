import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
`;

export const LetterSpan = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.COLORS.BLUE[200]};
  text-transform: uppercase;
  padding: 8px;
  white-space: nowrap;
`;

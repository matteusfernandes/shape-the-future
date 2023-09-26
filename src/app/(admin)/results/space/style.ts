import styled from 'styled-components';

export const Container = styled.div``;

export const WrapperButton = styled.div`
  width: 100%;
`;

export const Button = styled.button`
  flex: 1;
  width: 100%;
  padding: 20px;
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  color: ${({ theme }) => theme.COLORS.BLUE[200]};
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  font-size: 26px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all ease-in-out 0.2s;

  &:hover {
    color: ${({ theme }) => theme.COLORS.WHITE[900]};
    background-color: ${({ theme }) => theme.COLORS.BLUE[200]};
  }
`;

export const Content = styled.div`
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  overflow-y: auto;
  max-height: 560px;

  @media (max-width: 965px) {
    max-height: inherit;
    overflow: none;
  }

  & > div:nth-child(1n) {
    background: #707dbb;
  }

  & > div:nth-child(2n) {
    background: #ec72a1;
  }

  & > div:nth-child(3n) {
    background: #f0af83;
  }

  & > div:nth-child(4n) {
    background: #55b47a;
  }

  & > div:nth-child(5n) {
    background: #e7366e;
  }
`;

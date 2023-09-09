import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(2, 1fr);
  width: 100%;
  margin: 0 auto;
  height: 55px;
  max-height: 55px;
`;

export const Letter = styled.div`
  border: 0.5px ${({ theme }) => theme.COLORS.WHITE[100]} solid;
  color: ${({ theme }) => theme.COLORS.WHITE[100]};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  text-transform: uppercase;
  font-weight: 300;

  ${({ bold }) => bold && `font-weight: 700;`}

  @media (max-width: 480px) {
    font-size: 22px;
    border: 0.1px #ffffff3b solid;
  }
`;

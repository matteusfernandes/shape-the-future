import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const Row = styled.div<{ space?: boolean }>`
  display: grid;
  grid-template-columns: ${({ space }) =>
    space ? '2fr 3fr 1fr' : ' 2fr repeat(4, 1fr)'};
  border: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  color: ${({ theme }) => theme.COLORS.WHITE[900]};

  @media (max-width: 996px) {
    display: flex;
    flex-flow: row wrap;
  }

  div:last-child {
    border-right: none;
  }
`;

export const WrapperInfo = styled.div<{
  noBorder?: boolean;
  mobile?: boolean;
  mobileHidden?: boolean;
}>`
  border-right: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  ${({ noBorder }) => noBorder && `border: none;`}

  @media (max-width: 996px) {
    background: ${({ theme }) => theme.COLORS.WHITE[900]};
    color: ${({ theme }) => theme.COLORS.BLUE[200]};
    border-bottom: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
    width: 100%;
    position: sticky;
    top: 0;
  }

  @media (min-width: 640px) {
    ${({ mobile }) =>
      mobile &&
      css`
        display: none !important;
      `}
  }

  @media (max-width: 640px) {
    ${({ mobileHidden }) =>
      mobileHidden &&
      css`
        display: none !important;
      `}

    ${({ mobile }) =>
      mobile &&
      css`
        background: ${({ theme }) => theme.COLORS.BLUE[200]};
        color: ${({ theme }) => theme.COLORS.WHITE[900]};
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        font-weight: 500 !important;
      `}
  }
`;

export const InfoTitle = styled.h3`
  font-size: 28px;
  text-transform: uppercase;
`;

export const InfoDescription = styled.span`
  font-size: 10px;
  line-height: 22px;
`;

export const Cell = styled.div<{ padding?: string; mobileHidden?: boolean }>`
  border-right: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  padding: 10px 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  @media (max-width: 996px) {
    flex: 1;
  }
  @media (max-width: 640px) {
    width: 50%;
    flex: initial;
    border-top: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  }
  @media (max-width: 460px) {
    width: 100%;
    flex: initial;
    border-top: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  }

  ${({ padding }) => padding && `padding: ${padding};`}

  @media (max-width: 640px) {
    ${({ mobileHidden }) =>
      mobileHidden &&
      css`
        display: none !important;
      `}
  }
`;

export const CellInner = styled.div`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

export const CellLabel = styled.label`
  font-size: 10px;
  line-height: 16px;
`;

export const Select = styled.div<{ active?: boolean }>`
  border: 3px #ccc solid;
  min-height: 25px;
  min-width: 25px;
  margin-right: 10px;
  cursor: pointer;

  ${({ active }) =>
    active &&
    `
  background: #fff;
  `}
`;

export const Info = styled.h3`
  font-size: 22px;
  font-weight: 700;
`;

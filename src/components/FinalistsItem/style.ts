import styled, { css } from 'styled-components';

export const Container = styled.div<{ evaluation?: boolean }>`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;

  ${({ evaluation }) =>
    evaluation &&
    css`
      cursor: pointer;
    `}
`;

export const Content = styled.div<{
  background?: string;
  horizontal?: boolean;
  evaluation?: boolean;
}>`
  align-items: center;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  text-align: center;
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  padding: 20px;

  @media (max-width: 585px) {
    padding: 40px 20px;
  }

  ${({ background }) => background && `background-color: ${background}`};

  ${({ horizontal, theme }) =>
    horizontal &&
    css`
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      border-bottom: 1px ${theme.COLORS.WHITE[900]} solid;

      @media (max-width: 975px) {
        display: flex;
        flex-flow: column nowrap;
        padding: 40px 20px;
      }
    `}

  ${({ evaluation }) =>
    evaluation &&
    css`
      grid-template-columns: repeat(3, 1fr);
    `}
`;

export const Info = styled.h3<{ horizontal?: boolean }>`
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;

  @media (max-width: 585px) {
    margin-bottom: 20px;
  }

  ${({ horizontal }) =>
    horizontal &&
    css`
      font-size: 22px;
      font-weight: 700;

      @media (max-width: 975px) {
        margin: 20px 0;
      }
    `}
`;

export const Group = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const GroupTitle = styled.h4`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

export const GroupItem = styled.span<{ horizontal: boolean }>`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;

  @media (max-width: 585px) {
    font-size: 14px;
    margin-bottom: 10px;
  }

  ${({ horizontal }) =>
    horizontal &&
    css`
      font-size: 16px;
      font-weight: 700;

      @media (max-width: 975px) {
        font-size: 12px;
      }
    `}
`;

export const Finalist = styled.h3<{ horizontal: boolean }>`
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;

  ${({ horizontal }) =>
    horizontal &&
    css`
      font-size: 22px;
      font-weight: 700;
    `}
`;

export const Select = styled.div<{ active: boolean }>`
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

import styled, { css } from 'styled-components';

export const Container = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
`;

export const WrapperButton = styled.div`
  width: 100%;
  position: relative;
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

  @media (max-width: 768px) {
    text-align: left;
    font-size: 22px;
    padding-left: 10px;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;

  @media (max-width: 768px) {
    flex-flow: column nowrap;
  }

  @media (min-width: 768px) {
    min-height: 560px;
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

export const Selected = styled.div<{ active?: boolean }>`
  background-color: #151e53;
  border-radius: 25px;
  box-shadow: 0 0 2px #4156af;
  height: 30px;
  width: 100px;
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  transition: all ease-in-out 0.2s;
  padding: 0 10px;

  @media (max-width: 768px) {
    top: 15px;
    right: 10px;
  }

  &::before {
    content: '';
    display: block;
    background-color: #4156af;
    border-radius: 25px;
    width: 25px;
    height: 25px;
    position: absolute;
    left: 3px;
    top: 2px;
    cursor: pointer;
    transition: all ease-in-out 0.4s;
  }

  ${({ active }) =>
    active &&
    css`
      background-color: #4156af;
      justify-content: flex-start;
      &::before {
        background-color: #151e53;
        left: 70px;
      }
    `}
`;

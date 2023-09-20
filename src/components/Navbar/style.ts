import styled, { css } from 'styled-components';
import Link, { LinkProps } from 'next/link';

export const Container = styled.div`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  display: grid;
  grid-template-columns: 1fr 1fr 330px 1fr 1fr;
  transition: all ease-in-out 0.1s;

  @media (max-width: 960px) {
    display: flex;
  }
`;

export type MyLinkProps = LinkProps & {
  isStaff?: boolean;
};

export const MyLink = styled(Link)<MyLinkProps>`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  flex: 1;

  &:hover {
    color: ${({ theme }) => theme.COLORS.BLUE[200]};
    background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  }

  &.left {
    border-left: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  }

  &.active {
    color: ${({ theme }) => theme.COLORS.BLUE[200]};
    background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  }

  ${({ isStaff }) =>
    isStaff &&
    css`
      cursor: not-allowed;
      background: ${({ theme }) => theme.COLORS.BLUE[200]} !important;
    `}

  @media (max-width: 960px) {
    display: none;
  }
`;

export const ContentMobile = styled.div`
  width: 100%;
  @media (min-width: 960px) {
    display: none;
  }
`;

export const ContentMobileRoute = styled.span`
  color: ${({ theme }) => theme.COLORS.BLUE[200]};
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  font-size: 24px;
  font-weight: 500;
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const Hamburguer = styled.div`
  height: 55px;
  width: 90px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
  cursor: pointer;

  @media (min-width: 960px) {
    display: none;
  }
`;

export const Line = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  height: 5px;
  margin: 3px 0;
  width: 100%;
`;

type MenuProps = {
  show: boolean;
};

export const Menu = styled.div<MenuProps>`
  background: #fff;
  display: flex;
  height: 100%;
  width: 80%;
  position: fixed;
  flex-flow: column nowrap;
  right: -80%;
  top: 0;
  bottom: 0;
  z-index: 10;
  transition: all 0.2s ease-in-out;
  padding: 20px;

  @media (min-width: 960px) {
    display: none;
  }

  ${({ show }) =>
    show &&
    css`
      right: 0;
    `}
`;

export const MenuClose = styled.span`
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const ContentMenu = styled.div`
  flex: 1;
  flex-flow: column;
  padding-top: 20px;

  & > a {
    display: block;
    color: ${({ theme }) => theme.COLORS.BLUE[200]};
    border-bottom: 1px ${({ theme }) => theme.COLORS.BLUE[200]} solid;

    &:last-child {
      margin-top: auto;
    }
  }

  & > div {
    display: none;
  }
`;

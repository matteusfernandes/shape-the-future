'use client';

import Link from 'next/link';
import styled from 'styled-components';

export const ContainerDashboard = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const MenuDashboard = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  padding: 20px;
  gap: 20px;

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 14px;
    color: #fff;

    &::before {
      border: 1px #f1f1f1 solid;
      border-radius: 7.5px;
      content: '';
      display: inline-block;
      height: 15px;
      width: 15px;
      margin-right: 20px;
    }
  }

  @media (max-width: 960px) {
    display: none;
  }
`;

export const ContentDashboard = styled.div`
  flex: 1;
  padding: 20px;
`;

export const WrapperContent = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: 20px;
  height: 100%;

  h3 {
    font-size: 18px;
    color: #fff;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const HeaderButton = styled(Link)`
  border: none;
  border-radius: 4.5px;
  padding: 10px 20px;
  background: #00c1ce;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4.5px;
  background: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    opacity: 0.7;
  }
`;

export const WrapperContentForm = styled.div`
  max-height: 460px;
  overflow-x: auto;
  height: 100%;
`;

export const ContentForm = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: #fff;
  overflow-x: auto;
  height: 100%;
`;

export const FormLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  border-bottom: 1px #f1f1f1 solid;
  padding: 0 20px;
  min-height: 60px;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const FormName = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
  text-transform: capitalize;
  overflow: hidden;
  margin-right: 20px;

  span {
    @media (max-width: 760px) {
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 16px;
    }
  }
`;

export const WrapperButtons = styled.div`
  flex: 'inherit';
  padding: 0;

  display: flex;
  align-items: center;
  gap: 10px;
`;

'use client';

import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #fff;
  box-shadow: 0 0 15px #666;
  border-radius: 4.5px;
  display: flex;
  flex-flow: column nowrap;
  min-height: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  max-width: 680px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
`;
export const Title = styled.h3`
  margin-left: auto;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const Close = styled.div`
  margin-left: auto;
  font-size: 22px;
  cursor: pointer;
`;

export const Body = styled.div`
  flex: 1;
  padding: 20px;
  overflow-x: auto;
`;

export const Name = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
`;

export const Line = styled.div`
  align-items: center;
  border-bottom: 1px #f1f1f1 solid;
  display: flex;
  gap: 10px;
  padding: 12px 0;
  width: 100%;
`;

export const WrapperOption = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
`;

export const Option = styled.h3`
  font-size: 12px;
  font-weight: bold;
`;

export const Item = styled.span`
  flex: 1;
  font-size: 14px;
  line-height: 18px;
`;

export const ItemValue = styled.span`
  margin-left: auto;
`;

export const Total = styled.h2`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  margin-bottom: 30px;
`;

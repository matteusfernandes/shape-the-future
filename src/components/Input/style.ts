import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  margin-bottom: 20px;
  width: 100%;
`;

export const Label = styled.span`
  font-size: 22px;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  margin-bottom: 10px;
`;

export const InputText = styled.input`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  background: rgba(255, 255, 255, 0.5);
  max-width: 340px;
  width: 100%;
  height: 60px;
  padding: 20px;
  font-size: 18px;
  color: #1e1e1e;
  border-radius: 4.5px;
`;

export const SelectText = styled.select`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  background: rgba(255, 255, 255, 0.5);
  max-width: 340px;
  width: 100%;
  padding: 20px;
  font-size: 18px;
  color: #1e1e1e;
`;

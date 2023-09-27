import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  margin-bottom: 20px;
  width: 100%;
  position: relative;
`;

export const Label = styled.span`
  font-size: 18px;
  text-transform: uppercase;
  font-weight: 500;
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  margin-bottom: 10px;
  width: 100%;
`;

export const InputText = styled.input`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  background: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 50px;
  padding: 10px 20px;
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
  border-radius: 4.5px;
`;

export const AddedButton = styled.button<{ first?: boolean }>`
  position: absolute;
  border: none;
  background-color: transparent;
  height: 40px;
  font-size: 28px;
  bottom: 10px;
  right: ${(props) => (props.first ? '10px' : '50px')};
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  border: none;
  background-color: transparent;
  height: 40px;
  font-size: 28px;
  bottom: 10px;
  right: 50px;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }
`;

export const Error = styled.p`
  color: #f1f1f1;
  font-size: 18px;
  margin-top: 10px;
  text-transform: capitalize;
  width: 100%;
`;

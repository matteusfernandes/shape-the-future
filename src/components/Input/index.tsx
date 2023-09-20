import { forwardRef } from 'react';
import { Container, InputText, Label, SelectText } from './style';

type InputProps = {
  label?: string;
  select?: boolean;
  children?: React.ReactNode;
};

export const Input = forwardRef(function Input(
  { label, select, children, ...props }: InputProps,
  ref
) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      {!select && <InputText {...props} ref={ref} />}
      {select && <SelectText {...props}>{children}</SelectText>}
    </Container>
  );
});

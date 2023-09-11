import { Container, InputText, Label, SelectText } from './style';

type InputProps = {
  label?: string;
  select?: boolean;
  children?: React.ReactNode;
};

export function Input({ label, select, children, ...props }: InputProps) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      {!select && <InputText {...props} />}
      {select && <SelectText {...props}>{children}</SelectText>}
    </Container>
  );
}

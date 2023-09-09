import { Container, InputText, Label, SelectText } from './style';

export function Input({ label, select, children, ...props }) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      {!select && <InputText {...props} />}
      {select && <SelectText {...props}>{children}</SelectText>}
    </Container>
  );
}

import { HtmlHTMLAttributes, LegacyRef, forwardRef } from 'react';
import { Container, InputText, Label, SelectText } from './style';

type InputProps = HtmlHTMLAttributes<HTMLInputElement | HTMLSelectElement> & {
  label?: string;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
};

export const Input = forwardRef(function Input(
  { label, select, children, type, ...props }: InputProps,
  ref: LegacyRef<HTMLInputElement | HTMLSelectElement> | undefined
) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      {!select && <InputText type={type} {...props} ref={ref} />}
      {select && (
        <SelectText {...props} ref={ref}>
          {children}
        </SelectText>
      )}
    </Container>
  );
});

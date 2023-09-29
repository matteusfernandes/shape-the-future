import { HtmlHTMLAttributes, LegacyRef, forwardRef } from 'react';
import {
  AddedButton,
  Container,
  Error,
  InputText,
  Label,
  RemoveButton,
  SelectText,
  WrapperButtons
} from './style';

type InputProps = HtmlHTMLAttributes<HTMLInputElement | HTMLSelectElement> & {
  label?: string;
  type?: string;
  error?: string;
  select?: boolean;
  children?: React.ReactNode;
  addedField?: (() => void) | undefined | null;
  removeField?: (() => void) | undefined | null;
};

export const Input = forwardRef(function Input(
  {
    label,
    select,
    children,
    type,
    error,
    addedField,
    removeField,
    ...props
  }: InputProps,
  ref: LegacyRef<HTMLInputElement | HTMLSelectElement> | undefined
) {
  return (
    <Container>
      {label && <Label>{label}</Label>}
      <WrapperButtons>
        {!select && <InputText type={type} {...props} ref={ref} />}
        {select && (
          <SelectText {...props} ref={ref}>
            {children}
          </SelectText>
        )}
        {addedField && (
          <AddedButton type="button" onClick={addedField}>
            ✅
          </AddedButton>
        )}
        {removeField && (
          <RemoveButton type="button" onClick={removeField}>
            ❎
          </RemoveButton>
        )}
      </WrapperButtons>
      {error && <Error>{error}</Error>}
    </Container>
  );
});

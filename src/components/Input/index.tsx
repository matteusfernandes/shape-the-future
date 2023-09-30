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
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="#00d26a"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </AddedButton>
        )}
        {removeField && (
          <RemoveButton type="button" onClick={removeField}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="red"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </RemoveButton>
        )}
      </WrapperButtons>
      {error && <Error>{error}</Error>}
    </Container>
  );
});

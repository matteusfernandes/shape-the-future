import { Container } from './style';

type ButtonProps = {
  label?: string;
  borderless?: boolean;
  full?: boolean;
  disabled?: boolean;
  onClick?: () => Promise<void>;
};

export function Button({
  label,
  borderless = false,
  full,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Container
      borderless={borderless}
      full={full}
      disabled={disabled}
      {...props}
    >
      {label}
    </Container>
  );
}

import { Container } from './style';

type ButtonProps = HTMLButtonElement & {
  label?: string;
  borderless?: boolean;
  full?: boolean;
};

export function Button({
  label,
  borderless = false,
  full,
  ...props
}: ButtonProps) {
  return (
    <Container borderless={borderless} full={full} {...props}>
      {label}
    </Container>
  );
}

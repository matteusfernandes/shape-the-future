import { Container } from './style';

export function Button({ label, borderless, full, ...props }) {
  return (
    <Container borderless={borderless} full={full} {...props}>
      {label}
    </Container>
  );
}

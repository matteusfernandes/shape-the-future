import Link from 'next/link';
import { NotFoundContainer } from './style';

export default function NotFound() {
  return (
    <NotFoundContainer>
      <h2>Página não encontrada</h2>
      <p>sua requesição não pode ser completada</p>
      <Link href="/">Voltar para a Home</Link>
    </NotFoundContainer>
  );
}

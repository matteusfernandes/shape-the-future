'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container, Content } from './style';

export default function SignIn() {
  return (
    <Container>
      <Content>
        <Input label="Usuário" placeholder="Digite seu Usuário" required />

        <Input
          type="password"
          label="Senha"
          placeholder="Digite sua Senha"
          required
        />

        <Button label="Entrar" />
      </Content>
    </Container>
  );
}

'use client';

import { Container, Header, Options } from './style';

import { Navbar } from '../Navbar';
import { Lettering } from '../Lettering';

type WrapperPageProps = {
  children: React.ReactNode;
};

export function WrapperPage({ children }: WrapperPageProps) {
  return (
    <Container>
      <Header>
        <Options />
        <Options />
        <Options />
      </Header>

      <Navbar />

      <Lettering />
      {children}
    </Container>
  );
}

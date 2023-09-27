'use client';

import { useCallback, useMemo, useState } from 'react';
import _ from 'lodash';
import { usePathname } from 'next/navigation';

import { AuthButton } from '../AuthButton';
import { Logo } from '../Logo';
import {
  Container,
  ContentMenu,
  ContentMobile,
  ContentMobileRoute,
  Hamburguer,
  Line,
  Menu,
  MenuClose,
  MyLink
} from './style';
import { useSession } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const isAdminOrStaff = ['admin', 'staff'].includes(
    session?.user?.role as string
  );

  const isActive = useCallback(
    (path: string, otherClass: string = '') => {
      const rest = { className: ` ${otherClass}`, href: path };

      return _.includes(pathname, path)
        ? { ...rest, className: `active ${otherClass}` }
        : rest;
    },
    [pathname]
  );

  const adminRenderHeader = useMemo(() => {
    return (
      <>
        <MyLink {...isActive('/dashboard')}>Dashboard</MyLink>

        {session?.user?.role === 'staff' ? (
          <MyLink {...isActive('', 'left')} isStaff>
            Resultados
          </MyLink>
        ) : (
          <MyLink {...isActive('/results', 'left')}>Resultados</MyLink>
        )}

        <Logo />
        {session?.user?.role === 'staff' ? (
          <MyLink {...isActive('')} isStaff>
            Cronograma
          </MyLink>
        ) : (
          <MyLink {...isActive('/timeline')}>Cronograma</MyLink>
        )}

        <AuthButton {...isActive('/signin', 'left')} />
      </>
    );
  }, [isActive, session?.user?.role]);

  if (isAdminOrStaff) {
    return <Container>{adminRenderHeader}</Container>;
  }

  return (
    <Container>
      {!_.isEmpty(session) ? (
        <MyLink {...isActive('/evaluations')}>Avaliação</MyLink>
      ) : (
        <MyLink {...isActive('/')}>Home</MyLink>
      )}

      <MyLink {...isActive('/timeline', 'left')}>Cronograma</MyLink>

      <Logo />

      <MyLink {...isActive('/finalists')}>Finalistas</MyLink>

      <AuthButton {...isActive('/signin', 'left')} />

      <ContentMobile>
        <ContentMobileRoute>Home</ContentMobileRoute>
      </ContentMobile>

      <Menu show={showMenu}>
        <MenuClose onClick={() => setShowMenu(false)}>
          (X) Fechar Menu
        </MenuClose>

        <ContentMenu>
          {isAdminOrStaff ? (
            adminRenderHeader
          ) : (
            <>
              {!_.isEmpty(session) ? (
                <MyLink {...isActive('/evaluations')}>Avaliação</MyLink>
              ) : (
                <MyLink {...isActive('/')}>Home</MyLink>
              )}

              <MyLink {...isActive('/timeline', 'left')}>Cronograma</MyLink>

              <Logo />

              <MyLink {...isActive('/finalists')}>Finalistas</MyLink>

              <AuthButton {...isActive('/signin', 'left')} />
            </>
          )}
        </ContentMenu>
      </Menu>

      <Hamburguer onClick={() => setShowMenu(true)}>
        <Line />
        <Line />
        <Line />
      </Hamburguer>
    </Container>
  );
}

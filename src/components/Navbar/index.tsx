'use client';

import { useCallback, useState } from 'react';
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

export function Navbar() {
  const logged = false;
  const [showMenu, setShowMenu] = useState(false);
  const pathname = usePathname();

  // const adminRenderHeader = useMemo(() => {
  //   return (
  //     <>
  //       <MyLink to={'/'}>Cadastro</MyLink>
  //       {user.role === 'staff' ? (
  //         <MyLink className="left" isStaff>
  //           Resultados
  //         </MyLink>
  //       ) : (
  //         <MyLink to={'/results'} className="left">
  //           Resultados
  //         </MyLink>
  //       )}

  //       <Logo />
  //       {user.role === 'staff' ? (
  //         <MyLink isStaff>Cronograma</MyLink>
  //       ) : (
  //         <MyLink to={'/timeline'}>Cronograma</MyLink>
  //       )}

  //       <MyLink
  //         className="left"
  //         to={'/logoff'}
  //         onClick={(e) => {
  //           e.preventDefault();
  //           setShowMenu(false);
  //         }}
  //       >
  //         logoff
  //       </MyLink>
  //     </>
  //   );
  // }, []);

  const isActive = useCallback(
    (path: string, otherClass: string = '') => {
      const rest = { className: ` ${otherClass}`, href: path };

      return _.isEqual(pathname, path)
        ? { ...rest, className: `active ${otherClass}` }
        : rest;
    },
    [pathname]
  );

  return (
    <Container>
      {/* {isLogged && (isAdmin || isStaff) && adminRenderHeader} */}
      {logged ? (
        <MyLink {...isActive('/')}>Avaliação</MyLink>
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
          {/* {isLogged && (isAdmin || isStaff) && adminRenderHeader} */}
          {logged ? (
            <MyLink href="/">Avaliação</MyLink>
          ) : (
            <MyLink href="/">Home</MyLink>
          )}

          <MyLink {...isActive('/timeline', 'left')}>Cronograma</MyLink>

          <Logo />

          <MyLink {...isActive('/finalists')}>Finalistas</MyLink>

          <AuthButton {...isActive('/signin', 'left')} />
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

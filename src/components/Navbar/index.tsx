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

import { useCallback, useState } from 'react';
import _ from 'lodash';

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
    (path: string) => {
      const rest = { className: '', href: path };

      return _.isEqual(pathname, path)
        ? { ...rest, className: 'active' }
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

      <MyLink href="/timeline" className="left">
        Cronograma
      </MyLink>
      <Logo />
      <MyLink href="/finalists">Finalistas</MyLink>
      <AuthButton />

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
          <MyLink href="/timeline" className="left">
            Cronograma
          </MyLink>
          <Logo />
          <MyLink href="/finalists">Finalistas</MyLink>
          <AuthButton />
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

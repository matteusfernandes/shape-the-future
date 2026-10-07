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
  MyLink,
  MenuDashboard
} from './style';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { isAdminRole, isDashboardRole, isSigmaRole } from '@/constants';

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const isAdminOrStaff = isDashboardRole(session?.user?.role);

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
        {session?.user?.role === 'staff' ? (
          <MyLink
            {...isActive('', 'left')}
            isStaff
            onClick={() => setShowMenu(false)}
          >
            Resultados
          </MyLink>
        ) : (
          <MyLink
            {...isActive('/results', 'left')}
            onClick={() => setShowMenu(false)}
          >
            Resultados
          </MyLink>
        )}

        <Logo />
        {session?.user?.role === 'staff' ? (
          <MyLink {...isActive('')} isStaff onClick={() => setShowMenu(false)}>
            Cronograma
          </MyLink>
        ) : (
          <MyLink {...isActive('/timeline')} onClick={() => setShowMenu(false)}>
            Cronograma
          </MyLink>
        )}

        <AuthButton {...isActive('/signin', 'left')} />
      </>
    );
  }, [isActive, session?.user?.role]);

  return (
    <Container>
      {isAdminOrStaff ? (
        <>
          <MyLink {...isActive('/dashboard')}>Dashboard</MyLink>
          {adminRenderHeader}
        </>
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

      <ContentMobile href="/finalists">
        <ContentMobileRoute>VOTAR</ContentMobileRoute>
      </ContentMobile>

      <Menu show={showMenu}>
        <MenuClose onClick={() => setShowMenu(false)}>
          (X) Fechar Menu
        </MenuClose>

        <ContentMenu>
          {isAdminOrStaff ? (
            <>
              <MyLink
                {...isActive('/dashboard')}
                onClick={() => setShowMenu(false)}
              >
                Dashboard
              </MyLink>

              <MenuDashboard>
                {isAdminRole(session?.user?.role) ? (
                  <>
                    <Link
                      href="/dashboard/judget"
                      onClick={() => setShowMenu(false)}
                    >
                      Usuários
                    </Link>
                    <Link href="/dashboard" onClick={() => setShowMenu(false)}>
                      Espaços
                    </Link>
                    <Link
                      href="/dashboard/projects"
                      onClick={() => setShowMenu(false)}
                    >
                      Projetos
                    </Link>
                    {isSigmaRole(session?.user?.role) ? (
                      <Link
                        href="/dashboard/sigma"
                        onClick={() => setShowMenu(false)}
                      >
                        Sigma
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" onClick={() => setShowMenu(false)}>
                      Espaços
                    </Link>
                    <Link
                      href="/dashboard/judget"
                      onClick={() => setShowMenu(false)}
                    >
                      Jurados
                    </Link>
                    <Link
                      href="/dashboard/projects"
                      onClick={() => setShowMenu(false)}
                    >
                      Projetos
                    </Link>
                  </>
                )}
              </MenuDashboard>

              {adminRenderHeader}
            </>
          ) : (
            <>
              {!_.isEmpty(session) ? (
                <MyLink
                  {...isActive('/evaluations')}
                  onClick={() => setShowMenu(false)}
                >
                  Avaliação
                </MyLink>
              ) : (
                <MyLink {...isActive('/')} onClick={() => setShowMenu(false)}>
                  Home
                </MyLink>
              )}

              <MyLink
                {...isActive('/timeline', 'left')}
                onClick={() => setShowMenu(false)}
              >
                Cronograma
              </MyLink>

              <Logo />

              <MyLink
                {...isActive('/finalists')}
                onClick={() => setShowMenu(false)}
              >
                Finalistas
              </MyLink>

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

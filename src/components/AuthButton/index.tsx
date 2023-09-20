import _ from 'lodash';
import { signOut, useSession } from 'next-auth/react';

import { MyLink, MyLinkProps } from '../Navbar/style';

export function AuthButton({ ...rest }: MyLinkProps) {
  const { data } = useSession();

  return !_.isEmpty(data) ? (
    <MyLink
      className="left"
      href={''}
      onClick={async (e) => {
        e.preventDefault();
        await signOut();
      }}
    >
      Sair
    </MyLink>
  ) : (
    <MyLink {...rest}>Login</MyLink>
  );
}

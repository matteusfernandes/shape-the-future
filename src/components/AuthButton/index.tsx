import _ from 'lodash';
import { AnchorHTMLAttributes } from 'react';
import { signOut, useSession } from 'next-auth/react';

import { MyLink } from '../Navbar/style';

type AuthButtonProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function AuthButton({ ...rest }: AuthButtonProps) {
  const { data } = useSession();

  return !_.isEmpty(data) ? (
    <MyLink
      className="left"
      href=""
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

import { AnchorHTMLAttributes } from 'react';
import { MyLink } from '../Navbar/style';

type AuthButtonProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function AuthButton({ ...rest }: AuthButtonProps) {
  const logged = false;

  return logged ? (
    <MyLink
      className="left"
      href=""
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      Sair
    </MyLink>
  ) : (
    <MyLink {...rest}>Login</MyLink>
  );
}

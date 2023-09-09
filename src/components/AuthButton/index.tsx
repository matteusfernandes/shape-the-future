import { MyLink } from '../Navbar/style';

export function AuthButton() {
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
    <MyLink href="/signin" className="left">
      Login
    </MyLink>
  );
}

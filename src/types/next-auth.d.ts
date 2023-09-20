import 'next-auth';

interface IUser {
  id: number;
  username: string;
  role: string;
  spaceId: number;
  jwt: string;
}

declare module 'next-auth' {
  interface User extends IUser {}

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}

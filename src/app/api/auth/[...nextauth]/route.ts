import _ from 'lodash';
import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { http } from '@/lib/http';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: {
        username: string;
        password: string;
      }): Promise<User | null | undefined> {
        try {
          const { data } = (await http.post('/login', { ...credentials })) as {
            data: User;
          };

          if (!_.isEmpty(data)) {
            return data;
          }

          return null;
        } catch (err) {
          console.log(err);

          throw new Error(JSON.stringify(err?.response?.data?.message));
        }
      }
    })
  ],
  pages: {
    signIn: '/signin'
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token }) {
      if (!_.isEmpty(token.username)) {
        session.user.id = token.id.toString();
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.spaceId = token.spaceId;
        session.user.jwt = token.jwt;
      }

      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

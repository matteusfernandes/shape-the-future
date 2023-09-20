import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import _ from 'lodash';
import { redirect } from 'next/navigation';

type SignInRootProps = {
  children: React.ReactNode;
};

export default async function SignInRoot({ children }: SignInRootProps) {
  const session = await getServerSession(authOptions);

  if (!_.isEmpty(session)) {
    return redirect('/');
  }

  return children;
}

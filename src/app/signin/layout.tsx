import _ from 'lodash';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { authOptions } from '../api/auth/[...nextauth]/route';

type SignInRootProps = {
  children: React.ReactNode;
};

export default async function SignInRoot({ children }: SignInRootProps) {
  const session = await getServerSession(authOptions);

  if (!_.isEmpty(session)) {
    return redirect('/');
  }

  return <>{children}</>;
}

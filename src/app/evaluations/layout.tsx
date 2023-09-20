import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import _ from 'lodash';

type EvaluationsRootLayoutProps = {
  children: React.ReactNode;
};

export default async function EvaluationsRootLayout({
  children
}: EvaluationsRootLayoutProps) {
  const session = await getServerSession(authOptions);

  if (_.isEmpty(session?.user)) {
    return redirect('/');
  }

  return children;
}

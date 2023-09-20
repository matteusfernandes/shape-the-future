// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import _ from 'lodash';
import { redirect } from 'next/navigation';

type EvaluationRootProps = {
  children: React.ReactNode;
};

export default async function EvaluationRoot({
  children
}: EvaluationRootProps) {
  const session = await getServerSession(authOptions);

  if (!_.isEmpty(session)) {
    return redirect('/');
  }

  return children;
}

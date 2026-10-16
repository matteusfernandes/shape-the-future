import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isAdminRole } from '@/constants';

// Resultados são só para admin e sigma (o menu já os desabilita para staff)
export default async function ResultsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!isAdminRole(session?.user?.role)) {
    return redirect('/dashboard');
  }

  return <>{children}</>;
}

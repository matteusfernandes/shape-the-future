import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { isSigmaRole } from '@/constants';

export default async function ProjectImportLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!isSigmaRole(session?.user?.role)) {
    return redirect('/dashboard/projects');
  }

  return <>{children}</>;
}

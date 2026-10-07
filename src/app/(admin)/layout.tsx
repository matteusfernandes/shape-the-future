import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { isDashboardRole } from '@/constants';

export default async function AdminRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdminOrStaff = isDashboardRole(session?.user?.role);

  if (!isAdminOrStaff) {
    return redirect('/');
  }

  return <>{children}</>;
}

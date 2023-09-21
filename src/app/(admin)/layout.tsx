import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const isAdminOrStaff = ['admin', 'staff'].includes(
    session?.user?.role as string
  );

  if (!isAdminOrStaff) {
    return redirect('/');
  }

  return <>{children}</>;
}

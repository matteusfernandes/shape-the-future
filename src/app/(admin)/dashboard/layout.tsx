import Link from 'next/link';
import { ContainerDashboard, ContentDashboard, MenuDashboard } from './style';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type DashboardLayoutRootProps = {
  children: React.ReactNode;
};

export default async function DashboardLayoutRoot({
  children
}: DashboardLayoutRootProps) {
  const session = await getServerSession(authOptions);

  return (
    <ContainerDashboard>
      <MenuDashboard>
        <h3>cadastro</h3>
        <Link href="/dashboard">Espaços</Link>
        <Link href="/dashboard/judget">
          {session?.user?.role?.toLowerCase() === 'admin'
            ? 'Usuários'
            : 'Jurados'}
        </Link>
        <Link href="/dashboard/projects">Projetos</Link>
      </MenuDashboard>

      <ContentDashboard>{children}</ContentDashboard>
    </ContainerDashboard>
  );
}

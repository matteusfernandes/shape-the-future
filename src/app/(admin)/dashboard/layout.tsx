import Link from 'next/link';
import { ContainerDashboard, ContentDashboard, MenuDashboard } from './style';

type DashboardLayoutRootProps = {
  children: React.ReactNode;
};

export default function DashboardLayoutRoot({
  children
}: DashboardLayoutRootProps) {
  return (
    <ContainerDashboard>
      <MenuDashboard>
        <h3>cadastro</h3>
        <Link href="/dashboard">Espaços</Link>
        <Link href="/dashboard/judget">Jurados</Link>
        <Link href="/dashboard/projects">Projetos</Link>
      </MenuDashboard>

      <ContentDashboard>{children}</ContentDashboard>
    </ContainerDashboard>
  );
}

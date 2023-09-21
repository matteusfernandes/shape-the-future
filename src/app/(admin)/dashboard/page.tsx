import { ResultsLinks } from '@/components/ResultsLinks';

export default function Dashboard() {
  return (
    <ResultsLinks
      results={[
        {
          id: 0,
          background: '/images/avaliacoes.svg',
          link: '/dashboard/space',
          title: 'Espaços'
        },
        {
          id: 1,
          background: '/images/jurados.svg',
          link: '/dashboard/judget',
          title: 'Jurados'
        },
        {
          id: 2,
          background: '/images/populares.svg',
          link: '/dashboard/projects',
          title: 'Projetos'
        }
      ]}
    />
  );
}

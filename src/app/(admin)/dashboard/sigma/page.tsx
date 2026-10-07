'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { Overview } from '@/lib/sigma';

import {
  CardGrid,
  CardHeading,
  COLORS,
  HeaderContent,
  IconBox,
  PageStack,
  Panel,
  Stat,
  StatGrid,
  ToolCard,
  WrapperContent
} from '../style';

const TOOLS = [
  {
    href: '/dashboard/sigma/progress',
    icon: '📈',
    title: 'Andamento das Avaliações',
    description:
      'Quantos projetos cada jurado já avaliou e quais projetos ainda aguardam nota, por espaço.',
    color: '#4ECDC4',
    bg: '#E6F7F6'
  },
  {
    href: '/dashboard/sigma/consistency',
    icon: '🔎',
    title: 'Checagem de Conflitos',
    description:
      'Projetos no mesmo espaço e horário, espaços sem jurados, projetos sem integrantes e mais.',
    color: '#45B7D1',
    bg: '#E6F4F8'
  },
  {
    href: '/dashboard/sigma/finalists',
    icon: '⭐',
    title: 'Finalistas em Lote',
    description:
      'Veja a média de cada projeto e marque ou desmarque vários finalistas de uma vez.',
    color: '#FDCB6E',
    bg: '#FFF5E1'
  },
  {
    href: '/dashboard/projects/import',
    icon: '📊',
    title: 'Importar Projetos',
    description:
      'Cadastre projetos, integrantes e espaços a partir de uma planilha, com revisão antes de salvar.',
    color: '#E17055',
    bg: '#FFE9E4'
  },
  {
    href: '/dashboard/sigma/users/import',
    icon: '👥',
    title: 'Importar Usuários',
    description:
      'Cadastre jurados, staff e administradores a partir de uma planilha, com revisão antes de salvar.',
    color: '#6C5CE7',
    bg: '#EFEDFF'
  },
  {
    href: '/dashboard/sigma/access',
    icon: '🔐',
    title: 'Gestão de Acesso',
    description:
      'Altere a função de qualquer usuário, inclusive para sigma, e redefina senhas.',
    color: '#141E53',
    bg: '#E8EAF3'
  },
  {
    href: '/dashboard/sigma/new-edition',
    icon: '🗓️',
    title: 'Nova Edição',
    description:
      'Limpa projetos, notas e votos para começar uma nova edição do evento. Ação irreversível.',
    color: '#FF6B6B',
    bg: '#FFE6E6'
  }
];

export default function Sigma() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    http
      .get<Overview>('/sigma/overview')
      .then(({ data }) => setOverview(data))
      .catch(() => toast.error('Não foi possível carregar o resumo do evento'));
  }, []);

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Painel Sigma</h3>
      </HeaderContent>

      <PageStack>
        <Panel>
          <p>
            🛡️ Ferramentas exclusivas para usuários sigma: acompanhe o evento em
            tempo real, encontre inconsistências e execute ações em lote.
          </p>

          <StatGrid>
            <Stat>
              <strong>{overview?.projects ?? '–'}</strong>
              <span>projetos</span>
            </Stat>
            <Stat $color={COLORS.blue}>
              <strong>{overview?.students ?? '–'}</strong>
              <span>integrantes</span>
            </Stat>
            <Stat $color="#45B7D1">
              <strong>{overview?.spaces ?? '–'}</strong>
              <span>espaços</span>
            </Stat>
            <Stat $color={COLORS.success}>
              <strong>{overview?.users.judge ?? '–'}</strong>
              <span>jurados</span>
            </Stat>
            <Stat $color="#4ECDC4">
              <strong>{overview?.evaluations ?? '–'}</strong>
              <span>avaliações</span>
            </Stat>
            <Stat $color="#FDCB6E">
              <strong>{overview?.finalists ?? '–'}</strong>
              <span>finalistas</span>
            </Stat>
            <Stat
              $color={overview?.popularVoteActive ? COLORS.success : '#ccc'}
            >
              <strong>{overview?.publicVotes ?? '–'}</strong>
              <span>
                votos populares (
                {overview?.popularVoteActive ? 'votação aberta' : 'fechada'})
              </span>
            </Stat>
          </StatGrid>
        </Panel>

        <CardGrid>
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.href}
              href={tool.href}
              $color={tool.color}
              $bg={tool.bg}
            >
              <CardHeading>
                <IconBox $color={tool.color}>{tool.icon}</IconBox>
                <h4>{tool.title}</h4>
              </CardHeading>
              <p>{tool.description}</p>
            </ToolCard>
          ))}
        </CardGrid>
      </PageStack>
    </WrapperContent>
  );
}

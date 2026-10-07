'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { Consistency } from '@/lib/sigma';
import { EditIcon } from '@/components/Icons';

import {
  Badge,
  ButtonRow,
  COLORS,
  HeaderButton,
  HeaderContent,
  ItemList,
  ItemMeta,
  ListItem,
  Messages,
  OutlineButton,
  PageStack,
  Panel,
  PanelTitle,
  WrapperContent
} from '../../style';

type SectionProps = {
  icon: string;
  title: string;
  description: string;
  count: number;
  severity: 'error' | 'info';
  children: React.ReactNode;
};

function Section({
  icon,
  title,
  description,
  count,
  severity,
  children
}: SectionProps) {
  const color = !count
    ? COLORS.success
    : severity === 'error'
    ? COLORS.danger
    : COLORS.blue;

  return (
    <Panel style={{ borderLeft: `4px solid ${color}` }}>
      <ButtonRow style={{ justifyContent: 'space-between' }}>
        <PanelTitle>
          {icon} {title}
        </PanelTitle>
        <Badge $color={color} $bg="#f8f9fa">
          {count ? `${count} encontrado${count > 1 ? 's' : ''}` : 'Tudo certo'}
        </Badge>
      </ButtonRow>
      <p>{description}</p>
      {count ? (
        <ItemList>{children}</ItemList>
      ) : (
        <Messages $kind="success">
          <li>✅ Nenhum problema encontrado.</li>
        </Messages>
      )}
    </Panel>
  );
}

const EditLink = ({ href, title }: { href: string; title: string }) => (
  <Link href={href} title={title} style={{ color: COLORS.navy }}>
    <EditIcon />
  </Link>
);

export default function SigmaConsistency() {
  const [data, setData] = useState<Consistency | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await http.get<Consistency>('/sigma/consistency');
      setData(data);
    } catch {
      toast.error('Não foi possível carregar a checagem');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const problems = data
    ? data.scheduleConflicts.length +
      data.spacesWithoutJudges.length +
      data.projectsWithoutStudents.length +
      data.judgesWithoutSpace.length
    : 0;

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Checagem de Conflitos</h3>

        <HeaderButton href="/dashboard/sigma">Voltar</HeaderButton>
      </HeaderContent>

      {data ? (
        <PageStack>
          <Panel>
            <ButtonRow style={{ justifyContent: 'space-between' }}>
              <p>
                {problems
                  ? `🔎 Encontramos ${problems} ponto${
                      problems > 1 ? 's' : ''
                    } que precisa${problems > 1 ? 'm' : ''} de atenção.`
                  : '✅ Nenhuma inconsistência encontrada no cadastro do evento.'}
              </p>
              <OutlineButton type="button" onClick={load}>
                Verificar novamente
              </OutlineButton>
            </ButtonRow>
          </Panel>

          <Section
            icon="⏰"
            title="Projetos no mesmo espaço e horário"
            description="Dois ou mais projetos apresentando no mesmo lugar, ao mesmo tempo."
            count={data.scheduleConflicts.length}
            severity="error"
          >
            {data.scheduleConflicts.map((conflict) => (
              <ListItem
                key={`${conflict.spaceId}-${conflict.schedule}`}
                $accent={COLORS.danger}
                style={{ flexDirection: 'column', alignItems: 'stretch' }}
              >
                <strong>
                  📍 {conflict.spaceName ?? 'Sem espaço'} · ⏰{' '}
                  {conflict.schedule}
                </strong>
                {conflict.projects.map((project) => (
                  <ButtonRow
                    key={project.id}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <span>{project.title}</span>
                    <EditLink
                      href={`/dashboard/projects/${project.id}`}
                      title="Editar projeto"
                    />
                  </ButtonRow>
                ))}
              </ListItem>
            ))}
          </Section>

          <Section
            icon="🧑‍⚖️"
            title="Espaços com projetos e sem jurados"
            description="Os projetos destes espaços não serão avaliados por ninguém."
            count={data.spacesWithoutJudges.length}
            severity="error"
          >
            {data.spacesWithoutJudges.map((space) => (
              <ListItem key={space.id} $accent={COLORS.danger}>
                <div>
                  <strong>📍 {space.name}</strong>
                  <ItemMeta>
                    <span>{space.projects} projeto(s) sem avaliador</span>
                  </ItemMeta>
                </div>
                <Link
                  href="/dashboard/judget"
                  style={{ color: COLORS.navy, fontSize: '0.9em' }}
                >
                  Atribuir jurados →
                </Link>
              </ListItem>
            ))}
          </Section>

          <Section
            icon="👥"
            title="Projetos sem integrantes"
            description="Projetos cadastrados sem nenhum aluno."
            count={data.projectsWithoutStudents.length}
            severity="error"
          >
            {data.projectsWithoutStudents.map((project) => (
              <ListItem key={project.id} $accent={COLORS.danger}>
                <div>
                  <strong>{project.title}</strong>
                  <ItemMeta>
                    <span>⏰ {project.schedule}</span>
                    <span>📍 {project.spaceName ?? 'Sem espaço'}</span>
                  </ItemMeta>
                </div>
                <EditLink
                  href={`/dashboard/projects/${project.id}`}
                  title="Editar projeto"
                />
              </ListItem>
            ))}
          </Section>

          <Section
            icon="🚫"
            title="Jurados sem espaço"
            description="Jurados que não conseguem avaliar nenhum projeto porque não têm espaço."
            count={data.judgesWithoutSpace.length}
            severity="error"
          >
            {data.judgesWithoutSpace.map((judge) => (
              <ListItem key={judge.id} $accent={COLORS.danger}>
                <strong>{judge.username}</strong>
                <EditLink
                  href={`/dashboard/judget/${judge.id}`}
                  title="Editar jurado"
                />
              </ListItem>
            ))}
          </Section>

          <Section
            icon="ℹ️"
            title="Espaços sem projetos"
            description="Não é um erro, mas pode indicar um espaço que sobrou de outra edição."
            count={data.spacesWithoutProjects.length}
            severity="info"
          >
            {data.spacesWithoutProjects.map((space) => (
              <ListItem key={space.id} $accent={COLORS.blue}>
                <strong>📍 {space.name}</strong>
                <EditLink
                  href={`/dashboard/space/${space.id}`}
                  title="Editar espaço"
                />
              </ListItem>
            ))}
          </Section>
        </PageStack>
      ) : null}
    </WrapperContent>
  );
}

'use client';

import _ from 'lodash';
import { redirect } from 'next/navigation';

import {
  Columns,
  Content,
  ContentRight,
  Description,
  ImageFooter,
  ImageRight,
  LeftFooter,
  RightBlock,
  RightFooter,
  Title
} from './style';
import { useSession } from 'next-auth/react';
import { useRole } from '@/hooks/useRole';

export default function Home() {
  const { data: session } = useSession();
  const { isAdmin, isStaff } = useRole();

  if (!_.isEmpty(session?.user) && isAdmin) {
    return redirect('/dashboard/judget');
  }

  if (!_.isEmpty(session?.user) && isStaff) {
    return redirect('/dashboard');
  }

  if (!_.isEmpty(session?.user) && !isAdmin && !isStaff) {
    return redirect('/evaluations');
  }

  return (
    <>
      <Columns>
        <Content>
          <Title>Moldando hoje o mundo de amanhã</Title>
          <Description>
            Shaping the Future é uma iniciativa do Colégio Albert Sabin, em
            parceria com a Global Shapers Community, a rede de jovens do Fórum
            Econômico Mundial, que promove a discussão sobre futuros positivos
            através do protagonismo dos alunos. Neste ano, o evento aborda o
            tema &quot;Global Risk&quot;, incentivando mais de 80 projetos de
            estudantes a explorarem os riscos globais destacados no Global Risk
            Report. Em um dia dedicado à inovação e ao pensamento crítico, os
            jovens discutirão e proporão soluções criativas para enfrentar os
            desafios de curto e longo prazo que ameaçam o mundo contemporâneo.
          </Description>
        </Content>

        <ContentRight>
          <ImageRight src="/images/Ativo_1.svg" />
        </ContentRight>
      </Columns>

      <Columns>
        <LeftFooter>
          <ImageFooter src="/images/shapping.svg" />
        </LeftFooter>

        <RightFooter>
          <RightBlock>
            <span>+20 áreas de</span> conhecimento
          </RightBlock>

          <RightBlock>+350 Alunos</RightBlock>

          <RightBlock>80 projetos</RightBlock>
        </RightFooter>
      </Columns>
    </>
  );
}

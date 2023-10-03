import _ from 'lodash';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { http } from '@/lib/http';
import { authOptions } from './api/auth/[...nextauth]/route';

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

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdminOrStaff = ['admin', 'staff'].includes(
    session?.user?.role as string
  );

  http.interceptors.request.use(async (config) => {
    if (!_.isEmpty(session?.user)) {
      config.headers.Authorization = `${session?.user.jwt}`;
    }

    return config;
  });

  if (!_.isEmpty(session?.user) && isAdminOrStaff) {
    return redirect('/dashboard');
  }

  if (!_.isEmpty(session?.user) && !isAdminOrStaff) {
    return redirect('/evaluations');
  }

  return (
    <>
      <Columns>
        <Content>
          <Title>Moldando hoje o mundo de amanhã</Title>
          <Description>
            Shaping the Future é uma iniciativa do colégio Albert Sabin em
            parceria com a Global Shapers Network, rede de jovens do Fórum
            Econômico Mundial, que promove a discussão sobre futuros positivos
            através do protagonismo dos alunos. Um dia de evento com mais de 80
            projetos que discutem a quarta revolução industrial, seus impactos e
            possibilidades. Cada uma das iniciativas foi pensada e desenvolvida,
            desde o problema e até a solução, por estudantes que se colocaram no
            papel de agentes transformadores interessados em moldar o mundo no
            qual desejam viver.
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

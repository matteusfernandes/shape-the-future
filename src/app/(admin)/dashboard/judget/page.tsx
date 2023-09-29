import { http } from '@/lib/http';
import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent
} from '../style';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import _ from 'lodash';

type Space = { id: number; name: string };

type Judget = {
  id: number;
  username: string;
  password: string;
  role: string;
  spaceId: number;
};

export default async function Judget() {
  const session = await getServerSession(authOptions);

  const { data } = await http.get<Judget[]>('/user');
  const { data: spaces } = await http.get<Space[]>('/spaces');

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Jurados</h3>

        <HeaderButton href="/dashboard/judget/create">
          Adicionar Jurado
        </HeaderButton>
      </HeaderContent>

      <ContentForm>
        {data?.map((space) => {
          const spaceProject = spaces.find((s) => s?.id === space?.id);
          const isLoggedAndIsAdmin =
            !_.isEqual(session?.user?.id, space?.id?.toString()) &&
            _.isEqual(session?.user?.role, 'admin');

          return (
            <FormLine key={space?.id?.toString()}>
              <div>
                <span>{space?.username} | </span>

                <span>{spaceProject?.name}</span>
              </div>

              {isLoggedAndIsAdmin && (
                <RemoveButton>
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="red"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </RemoveButton>
              )}
            </FormLine>
          );
        })}
      </ContentForm>
    </WrapperContent>
  );
}

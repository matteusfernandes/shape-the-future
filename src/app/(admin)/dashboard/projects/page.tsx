import { http } from '@/lib/http';
import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent
} from '../style';

type Project = {
  id: number;
  title: string;
  subtitle: string;
  schedule: string;
  finalist: boolean;
  spaceId: number;
};

type Space = { id: number; name: string };

export default async function Projects() {
  const { data } = await http.get<Project[]>('/projects');
  const { data: spaces } = await http.get<Space[]>('/spaces');

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Projetos</h3>

        <HeaderButton>Adicionar Projeto</HeaderButton>
      </HeaderContent>

      <ContentForm>
        {data?.map((space) => {
          const spaceProject = spaces.find((s) => s?.id === space?.id);

          return (
            <FormLine key={space?.id?.toString()}>
              <div>
                <span>{space?.title}</span> | <span>{space?.subtitle}</span> |
                <span>{space?.schedule}</span> |{' '}
                <span>{spaceProject?.name}</span>
              </div>

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
            </FormLine>
          );
        })}
      </ContentForm>
    </WrapperContent>
  );
}

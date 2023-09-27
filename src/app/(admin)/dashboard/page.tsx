import { http } from '@/lib/http';
import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent
} from './style';

type Space = { id: number; name: string };

export default async function Dashboard() {
  const { data } = await http.get<Space[]>('/spaces');

  return (
    <WrapperContent>
      <HeaderContent>
        <h3>Todos os Espaços</h3>

        <HeaderButton>Adicionar Espaço</HeaderButton>
      </HeaderContent>

      <ContentForm>
        {data?.map((space) => (
          <FormLine key={space?.id?.toString()}>
            <span>{space?.name}</span>

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
        ))}
      </ContentForm>
    </WrapperContent>
  );
}

import { http } from '@/lib/http';
import { FormFinalistsVotes } from './form';

export default async function Space() {
  const { data } = await http.get('/projects');
  const { data: vote } = await http.get('/vote');

  return <FormFinalistsVotes projects={data} vote={vote[0].active} />;
}

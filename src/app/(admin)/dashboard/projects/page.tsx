import { http } from '@/lib/http';
import { FormProject } from './form';

export default async function Projects() {
  const { data: spacesData } = await http.get('/spaces');

  return <FormProject spaces={spacesData} />;
}

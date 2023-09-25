import { http } from '@/lib/http';
import { Form } from './form';

export default async function Judget() {
  const { data } = await http.get('/spaces');

  return <Form data={data} />;
}

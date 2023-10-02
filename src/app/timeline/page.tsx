import { http } from '@/lib/http';

import { TimelineSpaces } from './spaces';
import { Timeline } from './timelines';

export default async function Timeline() {
  const { data } = await http.get<Timeline[]>('/spaces/projects');

  console.log(data);

  return <TimelineSpaces spaces={data} />;
}

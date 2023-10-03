'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { http } from '@/lib/http';

import { BLOCK1, BLOCK2 } from '@/constants';
import { Timeline } from '../app/timeline/timelines';

export function useTimeline() {
  const [spaces, setSpaces] = useState<Timeline[]>([]);
  const [block, setBlock] = useState(true);

  const spacesFiltered = useMemo(() => {
    return spaces?.map((space) => ({
      ...space,
      projects: space?.projects?.filter((project) =>
        block
          ? BLOCK1.includes(project.schedule)
          : BLOCK2.includes(project.schedule)
      )
    }));
  }, [block, spaces]);

  const handleSpaces = useCallback(async () => {
    const { data } = await http.get<Timeline[]>('/spaces/projects');
    setSpaces(data);
  }, []);

  useEffect(() => {
    handleSpaces();
  }, [handleSpaces]);

  return {
    spacesFiltered,
    block,
    setBlock
  };
}

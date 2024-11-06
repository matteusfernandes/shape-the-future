'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { http } from '@/lib/http';

import { BLOCK1, BLOCK2, BLOCK3 } from '@/constants';
import { Timeline } from '../app/timeline/timelines';

export function useTimeline() {
  const [spaces, setSpaces] = useState<Timeline[]>([]);
  const [block, setBlock] = useState(1);

  const spacesFiltered = useMemo(() => {
    return spaces?.map((space) => ({
      ...space,
      projects: space?.projects?.filter((project) => {
        if (block === 1) {
          return BLOCK1.includes(project.schedule);
        } else if (block === 2) {
          return BLOCK2.includes(project.schedule);
        } else if (block === 3) {
          return BLOCK3.includes(project.schedule);
        }
      })
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

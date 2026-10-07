'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { http } from '@/lib/http';

import { BLOCK1, BLOCK2 } from '@/constants';
import { Timeline } from '../app/timeline/timelines';

export function useTimeline() {
  const [spaces, setSpaces] = useState<Timeline[]>([]);
  const [block, setBlock] = useState(1);
  const [error, setError] = useState(false);

  const spacesFiltered = useMemo(() => {
    return spaces?.map((space) => ({
      ...space,
      projects: space?.projects?.filter((project) => {
        if (block === 1) {
          return BLOCK1.includes(project.schedule);
        } else if (block === 2) {
          return BLOCK2.includes(project.schedule);
        }
      })
    }));
  }, [block, spaces]);

  const handleSpaces = useCallback(async () => {
    setError(false);

    try {
      const { data } = await http.get<Timeline[]>('/spaces/projects');
      setSpaces(data);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    handleSpaces();
  }, [handleSpaces]);

  return {
    spaces,
    spacesFiltered,
    error,
    reload: handleSpaces,
    block,
    setBlock
  };
}

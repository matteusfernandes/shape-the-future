'use client';

import { useState, useEffect, useCallback } from 'react';
import { http } from '@/lib/http';

import { Timeline } from '../app/timeline/timelines';

export function useTimeline() {
  const [spaces, setSpaces] = useState<Timeline[] | null>(null);
  const [error, setError] = useState(false);

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
    error,
    reload: handleSpaces
  };
}

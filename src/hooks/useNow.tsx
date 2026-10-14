'use client';

import { useEffect, useState } from 'react';

import { EVENT_DATE } from '@/constants';
import { toMinutes } from '@/lib/timeline';

const TICK_MS = 60_000;
const TIME_PATTERN = /^\d{1,2}:\d{2}$/;

const localDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');

/**
 * Minutos do dia "agora" para o cronograma, ou null quando o destaque em
 * tempo real não se aplica (fora do dia do evento).
 * `simulated` ("9:20") força um horário, útil para testar antes do evento.
 */
export function useNow(simulated?: string | null) {
  // null até montar no navegador, para não divergir da renderização do servidor
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(timer);
  }, []);

  if (simulated && TIME_PATTERN.test(simulated)) return toMinutes(simulated);
  if (!now || !EVENT_DATE || localDate(now) !== EVENT_DATE) return null;

  return now.getHours() * 60 + now.getMinutes();
}

import { SESSIONS } from '@/constants';
import { normalizeText } from '@/lib/text';
import type { Timeline } from '@/app/timeline/timelines';

export const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

// "Sessão 1" e "Sessão 2", com as mesmas cores do resto do sistema. Os
// horários não são exibidos no cronograma; servem só para ordenar e separar
// as sessões
export const TIMELINE_SESSIONS = SESSIONS.map((session) => ({
  label: session.label,
  color: session.color,
  start: toMinutes(session.schedules[0])
}));

// Classifica pelo horário de início para que nenhum projeto fique de fora,
// mesmo os cadastrados fora dos horários previstos de cada sessão
export const sessionOf = (start: number) =>
  start >= TIMELINE_SESSIONS[1].start ? 1 : 0;

export const joinNames = (names: string[]) =>
  names.length < 2
    ? names.join('')
    : `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}`;

// --- Caixa dos textos -------------------------------------------------------
// O backend grava títulos e nomes em MAIÚSCULAS. Para facilitar a leitura,
// textos totalmente em maiúsculas são exibidos em caixa normal.

const PARTICLES = new Set([
  'a',
  'à',
  'ao',
  'aos',
  'as',
  'às',
  'com',
  'da',
  'das',
  'de',
  'do',
  'dos',
  'e',
  'em',
  'na',
  'nas',
  'no',
  'nos',
  'o',
  'os',
  'ou',
  'para',
  'por'
]);

const isAllCaps = (text: string) =>
  text === text.toUpperCase() && text !== text.toLowerCase();

// Siglas sem vogal (TV, QR) e palavras com números ficam como estão
const keepAsIs = (word: string) =>
  /\d/.test(word) || !/[aeiouáàâãéêíóôõú]/i.test(word);

const capitalize = (word: string) =>
  word
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

export function formatName(text: string) {
  if (!isAllCaps(text)) return text;

  return text
    .trim()
    .split(/\s+/)
    .map((word, index) => {
      if (keepAsIs(word)) return word;
      const lower = word.toLowerCase();
      return index > 0 && PARTICLES.has(lower) ? lower : capitalize(lower);
    })
    .join(' ');
}

export function formatSentence(text: string) {
  if (!isAllCaps(text)) return text;

  const sentence = text
    .trim()
    .split(/\s+/)
    .map((word) => (keepAsIs(word) ? word : word.toLowerCase()))
    .join(' ');

  // Maiúscula no início e depois de ". " ou " - " (ex.: "Teste - Mapa...")
  return sentence.replace(
    /(^|[.!?]\s+|\s[-–]\s+)(\p{L})/gu,
    (_, before: string, letter: string) => before + letter.toUpperCase()
  );
}

// --- Dados -----------------------------------------------------------------

export type TimelineEntry = {
  id: number;
  spaceId: number;
  spaceName: string;
  start: number;
  session: number;
  title: string;
  subtitle: string;
  finalist: boolean;
  people: string;
  search: string;
};

export type TimelineSpace = { id: number; name: string };

export function buildEntries(spaces: Timeline[]) {
  const entries: TimelineEntry[] = spaces.flatMap((space) =>
    (space.projects ?? []).map((project) => {
      const names = (space.students ?? [])
        .filter((student) => student.projectId === project.id)
        .map((student) => formatName(student.name.trim()))
        .filter(Boolean);
      const start = toMinutes(project.schedule);

      return {
        id: project.id,
        spaceId: space.id,
        spaceName: formatName(space.name),
        start,
        session: sessionOf(start),
        title: formatSentence(project.title),
        subtitle: formatSentence(project.subtitle ?? ''),
        finalist: !!project.finalist,
        people: joinNames(names),
        search: normalizeText(
          `${project.title} ${project.subtitle ?? ''} ${names.join(' ')}`
        )
      };
    })
  );

  // Todos os espaços cadastrados aparecem no filtro "Onde?"
  const filterSpaces: TimelineSpace[] = spaces.map((space) => ({
    id: space.id,
    name: formatName(space.name)
  }));

  return {
    entries: entries.sort((a, b) => a.start - b.start || a.id - b.id),
    spaces: filterSpaces
  };
}

// --- Filtros ---------------------------------------------------------------

export const ALL = -1;

// Cada palavra digitada precisa aparecer, em qualquer ordem e sem diferenciar
// maiúsculas e acentos: "ana silva" encontra "Ana Souza da Silva"
export const matchesQuery = (entry: TimelineEntry, query: string) =>
  normalizeText(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => entry.search.includes(word));

export type Filters = { query: string; session: number; spaceId: number };

// Busca ∩ sessão ∩ espaço
export function applyFilters(entries: TimelineEntry[], filters: Filters) {
  const shown = entries.filter(
    (entry) =>
      matchesQuery(entry, filters.query) &&
      (filters.session === ALL || entry.session === filters.session) &&
      (filters.spaceId === ALL || entry.spaceId === filters.spaceId)
  );

  return { shown };
}

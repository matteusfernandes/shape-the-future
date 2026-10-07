import * as XLSX from 'xlsx';

import { normalizeText } from './text';

export { normalizeText };

export type Space = { id: number; name: string };

export const cellText = (row: unknown[], index: number) =>
  index < 0 ? '' : String(row[index] ?? '').trim();

export const findColumn = (header: unknown[], ...names: string[]) =>
  header.map(normalizeText).findIndex((name) => names.includes(name));

export type SheetRow = { row: unknown[]; line: number };

// Lê a aba preferida (ou a primeira) e devolve cabeçalho + linhas não vazias
export async function readSheet(file: File, preferredSheet: string) {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheet =
    workbook.Sheets[preferredSheet] ?? workbook.Sheets[workbook.SheetNames[0]];

  const [header = [], ...body] = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: true,
    defval: ''
  });

  const rows: SheetRow[] = body
    .map((row, index) => ({ row, line: index + 2 }))
    .filter(({ row }) => row.some((value) => String(value ?? '').trim()));

  return { header, rows };
}

export function addSheet(
  workbook: XLSX.WorkBook,
  name: string,
  rows: unknown[][],
  widths: number[]
) {
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols'] = widths.map((wch) => ({ wch }));
  XLSX.utils.book_append_sheet(workbook, sheet, name);
}

export const newWorkbook = () => XLSX.utils.book_new();

export function downloadWorkbook(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, filename, { bookType: 'xls' });
}

export const spacesSheetRows = (spaces: Space[]) => [
  ['Espaços cadastrados'],
  ...spaces.map((space) => [space.name])
];

// Rascunho da importação guardado na aba do navegador entre upload e revisão
export function draftStorage<T>(key: string) {
  return {
    save(value: T) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // sessionStorage indisponível: os dados ficam só em memória
      }
    },
    load(): T | null {
      try {
        const value = sessionStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : null;
      } catch {
        return null;
      }
    },
    clear() {
      try {
        sessionStorage.removeItem(key);
      } catch {
        // ignora
      }
    }
  };
}

export const draftKey = (line: number) =>
  `${line}-${Math.random().toString(36).slice(2)}`;

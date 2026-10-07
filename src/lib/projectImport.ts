import {
  Space,
  addSheet,
  cellText,
  downloadWorkbook,
  draftKey,
  draftStorage,
  findColumn,
  newWorkbook,
  normalizeText,
  readSheet,
  spacesSheetRows
} from './spreadsheet';

export type { Space };

export type ExistingProject = { title: string; subtitle: string };

export type ProjectDraft = {
  key: string;
  row: number;
  title: string;
  subtitle: string;
  schedule: string;
  // Espaço existente (spaceId) ou novo espaço a ser criado (spaceName)
  spaceId: number | null;
  spaceName: string;
  students: string[];
  warnings: string[];
};

export const projectDrafts = draftStorage<ProjectDraft[]>(
  'sigma:project-import'
);

export const PROJECTS_SHEET = 'Projetos';
export const STUDENT_COLUMNS = 8;

const HEADERS = [
  'Título',
  'Subtítulo',
  'Espaço',
  'Horário',
  ...Array.from({ length: STUDENT_COLUMNS }, (_, i) => `Integrante ${i + 1}`)
];

// Mesmos horários do cadastro manual: 8:00 até 18:45, de 15 em 15 minutos
export const SCHEDULES = Array.from({ length: 11 }, (_, i) => i + 8).flatMap(
  (hour) => ['00', '15', '30', '45'].map((min) => `${hour}:${min}`)
);

export const projectKey = (title: string, subtitle: string) =>
  `${title.trim().toUpperCase()}|${subtitle.trim().toUpperCase()}`;

const formatTime = (hours: number, minutes: number) =>
  `${hours}:${String(minutes).padStart(2, '0')}`;

// Aceita "9:00", "09:00", "9h", "9h30", hora inteira (9) ou hora do Excel (0.375)
export function parseSchedule(value: unknown): string | null {
  if (typeof value === 'number') {
    const totalMinutes = Math.round(value < 1 ? value * 24 * 60 : value * 60);
    return formatTime(Math.floor(totalMinutes / 60), totalMinutes % 60);
  }

  const match = String(value ?? '')
    .trim()
    .match(/^(\d{1,2})\s*[:hH]?\s*(\d{2})?/);

  if (!match) return null;

  return formatTime(Number(match[1]), Number(match[2] ?? 0));
}

export function downloadTemplate(spaces: Space[]) {
  const workbook = newWorkbook();

  addSheet(
    workbook,
    PROJECTS_SHEET,
    [HEADERS],
    HEADERS.map((_, i) => (i < 2 ? 40 : 22))
  );

  addSheet(
    workbook,
    'Instruções',
    [
      ['Como preencher'],
      [],
      [
        '1. Preencha a aba "Projetos": uma linha por projeto, a partir da linha 2.'
      ],
      ['2. Não altere os nomes das colunas da linha 1.'],
      [
        '3. Título, Espaço, Horário e pelo menos um Integrante são obrigatórios.'
      ],
      [
        '4. Espaço: use um nome da aba "Espaços". Um nome novo cria um novo espaço.'
      ],
      [
        '5. Horário: entre 8:00 e 18:45, de 15 em 15 minutos (ex.: 9:00, 9:15, 9:30).'
      ],
      [
        `6. Até ${STUDENT_COLUMNS} integrantes por projeto. Para mais, adicione colunas "Integrante 9", "Integrante 10"...`
      ],
      [
        '7. Depois do envio, todos os dados podem ser revisados e editados antes do cadastro.'
      ],
      [],
      ['Exemplo:'],
      HEADERS.slice(0, 7),
      [
        'Cidades Sustentáveis',
        'Energia solar nas escolas',
        spaces[0]?.name ?? 'Espaço Maker',
        '9:00',
        'Ana Souza',
        'Bruno Lima',
        'Carla Dias'
      ]
    ],
    [40, 30, ...HEADERS.map(() => 18)]
  );

  addSheet(workbook, 'Espaços', spacesSheetRows(spaces), [40]);

  downloadWorkbook(workbook, 'modelo-cadastro-projetos.xls');
}

export async function parseProjectsFile(
  file: File,
  spaces: Space[]
): Promise<ProjectDraft[]> {
  const { header, rows } = await readSheet(file, PROJECTS_SHEET);

  const columns = {
    title: findColumn(header, 'TITULO', 'PROJETO'),
    subtitle: findColumn(header, 'SUBTITULO', 'SUB TITULO'),
    space: findColumn(header, 'ESPACO'),
    schedule: findColumn(header, 'HORARIO'),
    students: header
      .map(normalizeText)
      .flatMap((name, index) =>
        /^(INTEGRANTE|ALUNO)/.test(name) ? [index] : []
      )
  };

  if (columns.title < 0 || columns.space < 0 || columns.schedule < 0) {
    throw new Error(
      'Planilha fora do modelo: as colunas Título, Espaço e Horário são obrigatórias.'
    );
  }

  const spacesByName = new Map(
    spaces.map((space) => [normalizeText(space.name), space])
  );

  return rows.map(({ row, line }) => {
    const warnings: string[] = [];

    const rawSchedule = row[columns.schedule];
    const parsedSchedule = parseSchedule(rawSchedule);
    const schedule =
      parsedSchedule && SCHEDULES.includes(parsedSchedule)
        ? parsedSchedule
        : '';

    if (!schedule && String(rawSchedule ?? '').trim()) {
      warnings.push(`Horário "${rawSchedule}" da planilha não é válido.`);
    }

    const spaceName = cellText(row, columns.space);
    const space = spacesByName.get(normalizeText(spaceName));

    if (spaceName && !space) {
      warnings.push(
        `Espaço "${spaceName}" da planilha não existe; marcado como novo espaço.`
      );
    }

    return {
      key: draftKey(line),
      row: line,
      title: cellText(row, columns.title),
      subtitle: cellText(row, columns.subtitle),
      schedule,
      spaceId: space?.id ?? null,
      spaceName: space ? '' : spaceName,
      students: columns.students
        .map((index) => cellText(row, index))
        .filter(Boolean),
      warnings
    };
  });
}

export function validateDrafts(
  drafts: ProjectDraft[],
  existing: ExistingProject[]
): Record<string, string[]> {
  const existingKeys = new Set(
    existing.map((project) => projectKey(project.title, project.subtitle ?? ''))
  );
  const counts = drafts.reduce<Record<string, number>>((acc, draft) => {
    const key = projectKey(draft.title, draft.subtitle);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.fromEntries(
    drafts.map((draft) => {
      const errors: string[] = [];
      const key = projectKey(draft.title, draft.subtitle);

      if (!draft.title.trim()) errors.push('Informe o título.');
      if (!draft.schedule) errors.push('Selecione o horário.');
      if (!draft.spaceId && !draft.spaceName.trim()) {
        errors.push('Selecione ou informe o espaço.');
      }
      if (!draft.students.some((name) => name.trim())) {
        errors.push('Adicione pelo menos um integrante.');
      }
      if (draft.title.trim() && counts[key] > 1) {
        errors.push('Título e subtítulo repetidos em outro card.');
      }
      if (draft.title.trim() && existingKeys.has(key)) {
        errors.push(
          'Já existe um projeto cadastrado com esse título e subtítulo.'
        );
      }

      return [draft.key, errors];
    })
  );
}

export function toImportPayload(drafts: ProjectDraft[]) {
  return {
    projects: drafts.map((draft) => ({
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      schedule: draft.schedule,
      ...(draft.spaceId
        ? { spaceId: draft.spaceId }
        : { spaceName: draft.spaceName.trim() }),
      students: draft.students.map((name) => name.trim()).filter(Boolean)
    }))
  };
}

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
import { CREDENTIAL_PATTERN } from '@/constants';

export type ExistingUser = { username: string };

export type UserDraft = {
  key: string;
  row: number;
  username: string;
  password: string;
  role: string;
  spaceId: number | null;
  warnings: string[];
};

export const userDrafts = draftStorage<UserDraft[]>('sigma:user-import');

export const USERS_SHEET = 'Usuários';

// Nomes aceitos na coluna "Função" da planilha
const ROLE_ALIASES: Record<string, string> = {
  JURADO: 'judge',
  JUIZ: 'judge',
  JUDGE: 'judge',
  STAFF: 'staff',
  ADMIN: 'admin',
  ADMINISTRADOR: 'admin',
  SIGMA: 'sigma'
};

const HEADERS = ['Usuário', 'Senha', 'Função', 'Espaço'];

export function downloadUsersTemplate(spaces: Space[]) {
  const workbook = newWorkbook();

  addSheet(workbook, USERS_SHEET, [HEADERS], [25, 20, 15, 35]);

  addSheet(
    workbook,
    'Instruções',
    [
      ['Como preencher'],
      [],
      [
        '1. Preencha a aba "Usuários": uma linha por usuário, a partir da linha 2.'
      ],
      ['2. Não altere os nomes das colunas da linha 1.'],
      [
        '3. Usuário e Senha: de 3 a 30 letras ou números, sem espaços ou acentos.'
      ],
      ['4. Função: Jurado, Staff, Admin ou Sigma.'],
      ['5. Espaço: obrigatório para jurados. Use um nome da aba "Espaços".'],
      [
        '6. Depois do envio, todos os dados podem ser revisados antes do cadastro.'
      ],
      [],
      ['Exemplo:'],
      HEADERS,
      ['anasouza', 'senha123', 'Jurado', spaces[0]?.name ?? 'Espaço Maker'],
      ['brunolima', 'senha456', 'Staff', '']
    ],
    [30, 20, 15, 35]
  );

  addSheet(workbook, 'Espaços', spacesSheetRows(spaces), [40]);

  downloadWorkbook(workbook, 'modelo-cadastro-usuarios.xls');
}

export async function parseUsersFile(
  file: File,
  spaces: Space[]
): Promise<UserDraft[]> {
  const { header, rows } = await readSheet(file, USERS_SHEET);

  const columns = {
    username: findColumn(header, 'USUARIO', 'LOGIN'),
    password: findColumn(header, 'SENHA'),
    role: findColumn(header, 'FUNCAO', 'ROLE'),
    space: findColumn(header, 'ESPACO')
  };

  if (columns.username < 0 || columns.password < 0 || columns.role < 0) {
    throw new Error(
      'Planilha fora do modelo: as colunas Usuário, Senha e Função são obrigatórias.'
    );
  }

  const spacesByName = new Map(
    spaces.map((space) => [normalizeText(space.name), space])
  );

  return rows.map(({ row, line }) => {
    const warnings: string[] = [];

    const rawRole = cellText(row, columns.role);
    const role = ROLE_ALIASES[normalizeText(rawRole)] ?? '';

    if (rawRole && !role) {
      warnings.push(`Função "${rawRole}" da planilha não é válida.`);
    }

    const spaceName = cellText(row, columns.space);
    const space = spacesByName.get(normalizeText(spaceName));

    if (spaceName && !space) {
      warnings.push(`Espaço "${spaceName}" da planilha não foi encontrado.`);
    }

    return {
      key: draftKey(line),
      row: line,
      username: cellText(row, columns.username),
      password: cellText(row, columns.password),
      role,
      spaceId: space?.id ?? null,
      warnings
    };
  });
}

export function validateUserDrafts(
  drafts: UserDraft[],
  existing: ExistingUser[]
): Record<string, string[]> {
  const existingNames = new Set(
    existing.map((user) => user.username.toUpperCase())
  );
  const counts = drafts.reduce<Record<string, number>>((acc, draft) => {
    const name = draft.username.trim().toUpperCase();
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  return Object.fromEntries(
    drafts.map((draft) => {
      const errors: string[] = [];
      const name = draft.username.trim().toUpperCase();

      if (!CREDENTIAL_PATTERN.test(draft.username.trim())) {
        errors.push(
          'Usuário deve ter de 3 a 30 letras ou números, sem espaços ou acentos.'
        );
      }
      if (!CREDENTIAL_PATTERN.test(draft.password.trim())) {
        errors.push(
          'Senha deve ter de 3 a 30 letras ou números, sem espaços ou acentos.'
        );
      }
      if (!draft.role) errors.push('Selecione a função.');
      if (draft.role === 'judge' && !draft.spaceId) {
        errors.push('Jurado precisa de um espaço.');
      }
      if (name && counts[name] > 1) {
        errors.push('Usuário repetido em outro card.');
      }
      if (name && existingNames.has(name)) {
        errors.push('Já existe um usuário cadastrado com esse nome.');
      }

      return [draft.key, errors];
    })
  );
}

export function toUsersPayload(drafts: UserDraft[]) {
  return {
    users: drafts.map((draft) => ({
      username: draft.username.trim(),
      password: draft.password.trim(),
      role: draft.role,
      spaceId: draft.spaceId
    }))
  };
}

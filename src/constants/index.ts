export const BLOCK1 = ['9:00', '9:15', '9:30', '9:45', '10:00'];
export const BLOCK2 = ['10:15', '10:30', '10:45', '11:00', '11:15'];

// Sessões de apresentação: cada uma tem uma cor fixa da paleta do projeto,
// usada no seletor, no aviso e nos cards do cronograma
export const SESSIONS = [
  {
    id: 1,
    label: 'Sessão 1',
    schedules: BLOCK1,
    color: '#55B47A',
    soft: '#E8F5EC'
  },
  {
    id: 2,
    label: 'Sessão 2',
    schedules: BLOCK2,
    color: '#EC72A1',
    soft: '#FDEAF2'
  }
];

// Data do evento (AAAA-MM-DD). No dia, o cronograma destaca o que está
// acontecendo "agora"; sem ela, esse destaque fica desligado.
export const EVENT_DATE = process.env.NEXT_PUBLIC_EVENT_DATE ?? '';

export const getSession = (id: number) =>
  SESSIONS.find((session) => session.id === id) ?? SESSIONS[0];

export const sessionRange = (schedules: string[]) =>
  `${schedules[0]} às ${schedules[schedules.length - 1]}`;

export const ROLES = {
  admin: 'ADMIN',
  staff: 'STAFF',
  judge: 'JUDGE',
  sigma: 'SIGMA'
};

// Roles com todos os privilégios de administrador
export const ADMIN_ROLES = ['admin', 'sigma'];

// Roles com acesso à área administrativa (dashboard)
export const DASHBOARD_ROLES = [...ADMIN_ROLES, 'staff'];

export const isAdminRole = (role?: string) =>
  ADMIN_ROLES.includes(role?.toLowerCase() ?? '');

export const isDashboardRole = (role?: string) =>
  DASHBOARD_ROLES.includes(role?.toLowerCase() ?? '');

export const isSigmaRole = (role?: string) => role?.toLowerCase() === 'sigma';

export const USER_ROLES = [
  { value: 'judge', label: 'Jurado' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
  { value: 'sigma', label: 'Sigma' }
];

// Mesma regra do login no backend: até 100 caracteres de qualquer tipo
// (há usuários com ponto e espaço), sem espaço no início ou no fim
export const CREDENTIAL_PATTERN = /^\S(?:.{0,98}\S)?$/;

// Intervalo entre votos populares do mesmo navegador (anti-spam). O servidor
// aplica o mesmo intervalo (PUBLIC_VOTE_COOLDOWN_SECONDS no backend).
export const PUBLIC_VOTE_COOLDOWN_SECONDS =
  Number(process.env.NEXT_PUBLIC_PUBLIC_VOTE_COOLDOWN_SECONDS) || 60;

// Mesmas cores dos badges da listagem de usuários
export const ROLE_BADGES: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  sigma: { label: 'SIGMA', color: '#6f42c1', bg: '#f0e9fb' },
  admin: { label: 'ADMIN', color: '#dc3545', bg: '#ffe6e9' },
  staff: { label: 'STAFF', color: '#0066ff', bg: '#e6f2ff' },
  judge: { label: 'JURADO', color: '#28a745', bg: '#e6f7ea' }
};

export const getRoleBadge = (role: string) =>
  ROLE_BADGES[role?.toLowerCase()] ?? {
    label: role?.toUpperCase(),
    color: '#666',
    bg: '#f0f0f0'
  };

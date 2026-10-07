export const BLOCK1 = ['9:00', '9:15', '9:30', '9:45', '10:00'];
export const BLOCK2 = ['10:15', '10:30', '10:45', '11:00', '11:15'];

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

export const isSigmaRole = (role?: string) =>
  role?.toLowerCase() === 'sigma';

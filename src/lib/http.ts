import axios from 'axios';
import _ from 'lodash';
import { getSession, signOut } from 'next-auth/react';

// Validade do token emitido pelo backend (expiresIn: '1d')
export const BACKEND_TOKEN_TTL_SECONDS = 24 * 60 * 60;

export const SESSION_EXPIRED_URL = '/signin?sessao=expirada';

// No navegador as chamadas passam pelo próprio domínio do site (/backend,
// repassado para a API em next.config.js); no servidor vão direto para a API
export const API_BASE_URL =
  typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API : '/backend/';

const http = axios.create({
  baseURL: API_BASE_URL
});

http.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (!_.isEmpty(session?.user)) {
    config.headers.Authorization = `${session?.user.jwt}`;
  }

  return config;
});

let signingOut = false;

// 401 numa chamada autenticada = token do backend expirado ou inválido.
// Encerra a sessão do site para o usuário entrar de novo, em vez de deixar
// todas as ações falhando com a sessão aparentemente ativa.
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const unauthorized = error?.response?.status === 401;
    const authenticated = !!error?.config?.headers?.Authorization;

    if (
      typeof window !== 'undefined' &&
      unauthorized &&
      authenticated &&
      !signingOut
    ) {
      signingOut = true;
      await signOut({ callbackUrl: SESSION_EXPIRED_URL });
    }

    return Promise.reject(error);
  }
);

export { http };

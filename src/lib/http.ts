import axios from 'axios';
import _ from 'lodash';
import { getSession } from 'next-auth/react';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API
});

http.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (!_.isEmpty(session?.user)) {
    config.headers.Authorization = `${session?.user.jwt}`;
  }

  return config;
});

export { http };

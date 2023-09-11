import axios from 'axios';

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API
});

// http.interceptors.request.use(async (config) => {
//   const getToken = (await localStorage.getItem('TESTE')) as string;
//   const data = JSON.parse(getToken);

//   if (data?.jwt) {
//     config.headers['authorization'] = data.jwt;
//   }

//   return config;
// });

export { http };

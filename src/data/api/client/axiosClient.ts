import axios, { type AxiosInstance } from 'axios';

import { DICTIONARY_BASE_URL } from '../endpoints';

export function createAxiosClient(): AxiosInstance {
  return axios.create({
    baseURL: `${DICTIONARY_BASE_URL}/`,
    timeout: 15000,
    headers: {
      Accept: 'application/json',
    },
  });
}

import { JsonApiError } from '../http.client';

export const fetchDocument = (url: string) => {
  if (url.indexOf('throwError') >= 0) {
    throw new JsonApiError({
      detail: 'test error',
    });
  }
  return {};
};

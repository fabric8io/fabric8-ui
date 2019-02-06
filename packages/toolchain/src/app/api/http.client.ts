import { AxiosError } from 'axios';
import axiosClient from './internal/axios.client';
import {
  DataDocument,
  ErrorsDocument,
  ErrorObject,
  JsonApiError as IJsonApiError,
  MetaObject,
} from './models/jsonapi';

export class JsonApiError extends Error implements IJsonApiError {
  constructor(readonly error: ErrorObject) {
    super(error.detail || error.title);
  }
}

export async function fetch<T>(url: string): Promise<T> {
  return (await axiosClient.get<T>(url)).data;
}

export async function fetchDocument(url: string): Promise<DataDocument> {
  try {
    return fetch<DataDocument>(url);
  } catch (e) {
    const axiosError = e as AxiosError;
    const { response } = axiosError;
    if (response) {
      const data = response.data as ErrorsDocument;
      if (data && data.errors && data.errors[0]) {
        throw new JsonApiError(data.errors[0]);
      }
      throw new JsonApiError({
        status: `${response.status}`,
        title: response.statusText,
        detail: response.statusText,
      });
    }
    throw new JsonApiError({
      detail: e.message,
    });
  }
}

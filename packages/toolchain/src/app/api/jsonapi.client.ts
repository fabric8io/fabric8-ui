import { AxiosError } from 'axios';
import axiosClient from './internal/axios.client';
import {
  DataDocument,
  ErrorsDocument,
  ErrorObject,
  JsonApiError as IJsonApiError,
} from './models/jsonapi';

export class JsonApiError extends Error implements IJsonApiError {
  constructor(readonly error: ErrorObject) {
    super(error.detail || error.title);
  }
}

// function createJsonApiError(error: ErrorObject): JsonApiError {
//   const e: any = new Error(error.detail || error.title);
//   e.error = error;
//   return e;
// }

export async function fetchDocument(url: string): Promise<DataDocument> {
  try {
    return (await axiosClient.get<DataDocument>(url)).data;
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

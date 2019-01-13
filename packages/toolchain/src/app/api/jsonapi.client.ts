import axiosClient from './internal/axios.client';
// import { getEntityUrl } from './api-urls';
import { DataDocument } from './models/jsonapi';

// export async function fetchEntity(type: string, id: string): Promise<DataDocument> {
//   return (await axiosClient.get<DataDocument>(getEntityUrl(type, id))).data;
// }

export async function fetchDocument(url: string): Promise<DataDocument> {
  return (await axiosClient.get<DataDocument>(url)).data;
}

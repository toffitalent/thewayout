import axios from 'axios';
import { MediaType } from '@two/shared';
import { client } from './client';

export interface Upload {
  fields: Record<string, string>;
  key: string;
  url: string;
}

async function create(type: MediaType, file: File) {
  // Retrieve presigned S3 POST data
  const {
    data: { fields, key, url },
  } = await client.post<Upload>(`/v1/uploads/${type}`, { contentType: 'image/jpeg' });

  // Upload file to S3
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
  formData.append('file', file);

  await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

  return { key };
}

export const uploads = { create };

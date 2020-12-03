import { DrupalEntity } from './Entity';

export interface JsonApiResponse {
  data: DrupalEntity[];
  included?: DrupalEntity[];
}

export type JsonApiRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

import { JsonApiRequestMethod, JsonApiResponse } from './type/Drupal/JsonApi';
import fetch from 'node-fetch';

async function request({
  base = null,
  requestMethod = 'GET',
  entity = 'node',
  bundle = null,
}: {
  base: string;
  requestMethod: JsonApiRequestMethod;
  entity: string;
  bundle: string;
}): JsonApiResponse {
  if (!bundle) {
    bundle = entity;
  }
  const response = await fetch(`${base}/jsonapi/${entity}/${bundle}`, {
    method: requestMethod,
  });
  const json: JsonApiResponse = await response.json();

  return json;
}

export { request };

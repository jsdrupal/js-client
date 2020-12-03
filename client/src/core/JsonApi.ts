import { JsonApiRequestMethod, JsonApiResponse } from './type/Drupal/JsonApi';
import fetch from 'node-fetch';

async function request({
  base = null,
  requestMethod = 'GET',
  entity = 'node',
}: {
  base: string;
  requestMethod: JsonApiRequestMethod;
  entity: string;
  bundle?: string;
}): Promise<JsonApiResponse> {
  // Strip trailing slash from the base URL.
  if (base.substr(-1) === '/') {
    base = base.substr(0, base.length - 1);
  }

  const response = await fetch(`${base}/${entity}`, {
    method: requestMethod,
  });
  const json: JsonApiResponse = await response.json();

  return json;
}

export { request };

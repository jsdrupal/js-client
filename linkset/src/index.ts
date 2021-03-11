import { Linkset } from './core/linkset';
import type { LinksetInterface as NormalizedLinksetInterface } from './spec/linkset-json';
import type { LinkInterface } from './core/link';
import type { LinksetInterface, NormalizableLinksetInterface } from './core/linkset';

/**
 * Denormalizes a set of links into an instance of a Linkset.
 * {@inheritDoc Linkset.from}
 * {@see {@link NormalizedLinksetInterface}}
 */
function denormalize(normalized: NormalizedLinksetInterface): Linkset {
  return Linkset.from(normalized);
}

/**
 * Parses an application/linkset+json document into a Linkset instance.
 * {@see {@link denormalize}}
 */
function parse(json: string): Linkset {
  return denormalize(JSON.parse(json));
}

export {
  parse,
  denormalize,
  LinkInterface,
  LinksetInterface,
  NormalizedLinksetInterface,
  NormalizableLinksetInterface,
};

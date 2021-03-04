import { LinksetInterface as NormalizedLinksetInterface } from './spec/linkset-json';
import { LinkInterface } from './core/link';
import { Linkset, LinksetInterface, NormalizableLinksetInterface } from './core/linkset';

/**
 * Denormalizes a set of links into an instance of a Linkset.
 * {@inheritDoc Linkset.from}
 */
function denormalize(normalized: NormalizedLinksetInterface): Linkset {
  return Linkset.from(normalized);
}

export {
  denormalize,
  LinkInterface,
  LinksetInterface,
  NormalizedLinksetInterface,
  NormalizableLinksetInterface,
};

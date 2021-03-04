import { LinkSetInterface as NormalizedLinkSetInterface } from './internal/normalization';
import { LinkInterface } from './internal/link';
import { LinkSet, LinkSetInterface, NormalizableLinkSetInterface } from './internal/linkset';

/**
 * Denormalizes a set of links into an instance of a LinkSet.
 * {@inheritDoc LinkSet.from}
 */
function denormalize(normalized: NormalizedLinkSetInterface): LinkSet {
  return LinkSet.from(normalized);
}

export {
  denormalize,
  LinkInterface,
  LinkSetInterface,
  NormalizableLinkSetInterface,
};

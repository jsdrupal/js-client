import { LinkSetInterface as NormalizedLinkSetInterface } from './internal/normalization';
import { LinkInterface } from './internal/link';
import { LinkSet, LinkSetInterface, NormalizableLinkSetInterface } from './internal/linkset';

function denormalize(normalized: NormalizedLinkSetInterface): LinkSet {
  return LinkSet.from(normalized);
}

export {
  denormalize,
  LinkInterface,
  LinkSetInterface,
  NormalizableLinkSetInterface,
};

import { LinkInterface, Link } from './link';
import { LinksetInterface as NormalizedLinksetInterface, TargetObject } from '../spec/linkset-json'

/**
 * A set of links and useful link utilities.
 * Provides useful methods for programming behaviors based on the presence and
 * context of links.
 * @example
 * For example, one might prompt for credentials if an `authenticate` link is
 * present and then start a user session:
 * ```
 * if (linkset.linksFrom(window.location.href).hasLinkTo('authenticate')) {
 *   // ... get user credentials ...
 *   fetch(linkset.linkTo('authenticate').href, {
 *     method: 'POST',
 *     body: JSON.stringify(credentials),
 *     credentials: 'same-origin',
 *   });
 * }
 * ```
 */
export interface LinksetInterface extends Iterable<LinkInterface> {
  /**
   * A read-only array of links.
   */
  readonly elements: LinkInterface[];
  /**
   * The number of links in the set.
   */
  readonly size: number;
  /**
   * Check if a link with a given relation type is present in the set.
   * @returns True if at least one link has the given relation, false otherwise.
   */
  hasLinkTo(relationType: string): boolean;
  /**
   * Get the a single link with a given relation type, if one exists.
   * @returns A link if a link with the relation type is present, or undefined.
   */
  linkTo(relationType: string): LinkInterface | undefined;
  /**
   * Get a subset of links containing only the links with the given relation.
   * @returns A new linkset. Empty if no links have the given relation type.
   */
  linksTo(relationType: string): LinksetInterface;
  /**
   * Get a subset of links with the given context IRI.
   * @returns A new linkset. Empty if no links have the given context.
   */
  linksFrom(anchor: string): LinksetInterface;
}

/**
 * Use for normalizing an object into a serializable object.
 * @typeParam T - An interface representing an object that conforms to the
 *   application/linkset+json media type specification.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00|draft-ietf-httpapi-linkset-00: Linkset}
 */
export interface NormalizableLinksetInterface<T extends NormalizedLinksetInterface> extends LinksetInterface {
  /**
   * {@inheritDoc Normalizable.normalize}
   */
  normalize(): T;
};

/**
 * A set of links.
 * @internal
 */
export class Linkset implements NormalizableLinksetInterface<NormalizedLinksetInterface> {
  /**
   * {@inheritDoc LinksetInterface.elements}
   */
  readonly elements: LinkInterface[];
  constructor(links: LinkInterface[]) {
    this.elements = links;
  }
  /**
   * {@inheritDoc LinksetInterface.size}
   */
  get size(): number {
    return this.elements.length;
  }
  /**
   * {@inheritDoc LinksetInterface.hasLinkTo}
   */
  hasLinkTo(relationType: string): boolean {
    return this.elements.some((link) => link.rel === relationType);
  }
  /**
   * {@inheritDoc LinksetInterface.linkTo}
   */
  linkTo(relationType: string): LinkInterface | undefined {
    return this.elements.find((link) => link.rel === relationType);
  }
  /**
   * {@inheritDoc LinksetInterface.linksTo}
   */
  linksTo(relationType: string): LinksetInterface {
    return new Linkset(this.elements.filter((link) => link.rel === relationType));
  }
  /**
   * {@inheritDoc LinksetInterface.linksFrom}
   */
  linksFrom(anchor: string): LinksetInterface {
    return new Linkset(this.elements.filter((link) => link.anchor === anchor));
  }
  /**
   * Implements the iterable protocol.
   */
  [Symbol.iterator](): Iterator<LinkInterface> {
    const elems = this.elements;
    let pointer = 0;
    return {
      next(): IteratorResult<LinkInterface> {
        if (pointer < elems.length) {
          return {value: elems[pointer++], done: false};
        } else {
          return {value: undefined, done: true};
        }
      }
    };
  }
  /**
   * {@inheritDoc NormalizableLinksetInterface.normalize}
   */
  normalize(): NormalizedLinksetInterface {
    const contexts: {
      [anchor: string]: {
        [rel: string]: TargetObject[];
      };
    } = {};
    this.elements.forEach(({ anchor, rel, ...target }) => {
      if (!Object.hasOwnProperty.call(contexts, anchor)) contexts[anchor] = {};
      if (!Object.hasOwnProperty.call(contexts[anchor], rel)) contexts[anchor][rel] = [];
      const { href, attributes } = target;
      const targetObject = { href, ...attributes };
      contexts[anchor][rel].push(targetObject);
    });
    return {
      linkset: Object.entries(contexts).reduce((carry, [anchor, rels]) => {
        return [...carry, { anchor, ...rels }];
      }, []),
    };
  }
  /**
   * Denormalizes a linkset.
   * @param normalized - An object conforming to the application/linkset+json
   *   media type specification.
   * @returns A new Linkset.
   */
  static from(normalized: NormalizedLinksetInterface): Linkset {
    const links = [];
    normalized.linkset.forEach((contextObject) => {
      const { anchor, ...rels } = contextObject;
      Object.keys(rels).forEach((rel) => {
        contextObject[rel].forEach((targetObject) => {
          links.push(new Link({ anchor, rel, ...targetObject }));
        });
      });
    });
    return new Linkset(links);
  }
}

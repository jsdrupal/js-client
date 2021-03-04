import { LinkInterface, TargetAttributes, Link } from './link';
import { LinkSetInterface as NormalizedLinkSetInterface, Normalizable } from './normalization'

export interface LinkSetInterface extends Iterable<LinkInterface> {
  readonly elements: LinkInterface[];
  readonly size: number;
  hasLinkTo(relationType: string): boolean;
  linkTo(relationType: string): LinkInterface | undefined;
  linksTo(relationType: string): LinkSetInterface;
  linksFrom(anchor: string): LinkSetInterface;
}

export interface NormalizableLinkSetInterface<T extends NormalizedLinkSetInterface> extends Normalizable<T>, LinkSetInterface {
  normalize(): T;
};

export class LinkSet implements NormalizableLinkSetInterface<NormalizedLinkSetInterface> {
  readonly elements: LinkInterface[];
  private iterationIndex: number;
  constructor(links: LinkInterface[]) {
    this.iterationIndex = 0;
    this.elements = links;
  }
  get size(): number {
    return this.elements.length;
  }
  hasLinkTo(relationType: string): boolean {
    return this.elements.some((link) => link.rel === relationType);
  }
  linkTo(relationType: string): LinkInterface | undefined {
    return this.elements.find((link) => link.rel === relationType);
  }
  linksTo(relationType: string): LinkSetInterface {
    return new LinkSet(this.elements.filter((link) => link.rel === relationType));
  }
  linksFrom(anchor: string): LinkSetInterface {
    return new LinkSet(this.elements.filter((link) => link.anchor === anchor));
  }
  [Symbol.iterator](): IterableIterator<LinkInterface> {
    return this;
  }
  next(): IteratorResult<LinkInterface> {
    if (this.iterationIndex < this.elements.length) {
      return {value: this.elements[this.iterationIndex++], done: false};
    } else {
      return {value: undefined, done: true};
    }
  }
  normalize(): NormalizedLinkSetInterface {
    const contexts: {
      [anchor: string]: {
        [rel: string]: ({href: string} & TargetAttributes)[];
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
  static from(normalized: NormalizedLinkSetInterface): LinkSet {
    const links = [];
    normalized.linkset.forEach((contextObject) => {
      const { anchor, ...rels } = contextObject;
      Object.keys(rels).forEach((rel) => {
        contextObject[rel].forEach((targetObject) => {
          links.push(new Link({ anchor, rel, ...targetObject }));
        });
      });
    });
    return new LinkSet(links);
  }
}

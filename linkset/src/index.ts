import NormalizedLinkSet from './types/normalization';
import { LinkInterface, TargetAttributes } from './types/link';

interface Normalizable<T> {
  normalize(): T;
}

class Link implements LinkInterface {
  public anchor: string;
  public rel: string;
  public href: string;
  public attributes: TargetAttributes;
  constructor(parameters) {
    const { anchor, rel, href, ...attributes } = parameters;
    this.anchor = anchor;
    this.rel = rel;
    this.href = href;
    this.attributes = attributes;
  }
}

interface LinkSetInterface extends Iterable<LinkInterface> {
  readonly elements: LinkInterface[];
  readonly size: number;
  hasLinkTo(relationType: string): boolean;
  linkTo(relationType: string): LinkInterface | undefined;
  linksTo(relationType: string): LinkSetInterface;
  linksFrom(anchor: string): LinkSetInterface;
}

class LinkSet implements LinkSetInterface, Normalizable<NormalizedLinkSet> {
  readonly elements: LinkInterface[];
  private iterationIndex: number;
  constructor(links: LinkInterface[]) {
    this.iterationIndex = 0;
    this.elements = links;
  }
  get size() {
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
  [Symbol.iterator]() {
    return this;
  }
  next() {
    if (this.iterationIndex < this.elements.length) {
      return {value: this.elements[this.iterationIndex++], done: false};
    } else {
      return {value: undefined, done: true};
    }
  }
  normalize(): NormalizedLinkSet {
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
}

export function denormalize(normalized: NormalizedLinkSet): LinkSet {
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

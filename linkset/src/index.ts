type InternationalizedValue = {
  value: string;
  language?: string;
}

interface RegisteredTargetAttributes {
  readonly hreflang?: string[];
  readonly media?: string;
  readonly type?: string;
  readonly title?: string;
  readonly 'title*'?: InternationalizedValue[];
};

interface TargetAttributes extends RegisteredTargetAttributes {
  readonly [name: string]: string | string[] | InternationalizedValue[];
}

type NormalizedTargetObject = {
  href: string;
} & TargetAttributes;

type NormalizedContextObject = {
  anchor: string;
} & {
  [rel: string]: NormalizedTargetObject[];
};

type NormalizedLinkSet = {
  linkset: NormalizedContextObject[];
};

interface Normalizable<T> {
  normalize(): T;
}

interface LinkInterface {
  readonly anchor: string;
  readonly rel: string;
  readonly href: string;
  readonly attributes: TargetAttributes;
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
  hasLinksTo(relationType: string): boolean;
  linksTo(relationType: string): LinkSetInterface;
  linkTo(relationType: string): LinkInterface | undefined;
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
  hasLinksTo(relationType: string): boolean {
    return this.elements.some((link) => link.rel === relationType);
  }
  linksTo(relationType: string): LinkSetInterface {
    return new LinkSet(this.elements.filter((link) => link.rel === relationType));
  }
  linkTo(relationType: string): LinkInterface | undefined {
    return this.elements.find((link) => link.rel === relationType);
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
        [rel: string]: NormalizedTargetObject[];
      };
    } = {};
    this.elements.forEach(({ anchor, rel, ...target }) => {
      if (!Object.hasOwnProperty.call(contexts, anchor)) contexts[anchor] = {};
      if (!Object.hasOwnProperty.call(contexts[anchor], rel)) contexts[anchor][rel] = [];
      const { href, attributes } = target;
      const targetObject: NormalizedTargetObject = { href, ...attributes };
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
    Object.entries(rels).forEach(([rel, targetObjects]) => {
      targetObjects.forEach((targetObject) => {
        links.push(new Link({ anchor, rel, ...targetObject }));
      });
    });
  });
  return new LinkSet(links);
}

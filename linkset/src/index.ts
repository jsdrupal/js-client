type InternationalizedValue = {
  value: string;
  language?: string;
}

interface TargetAttributes {
  [name: string]: string | string[] | InternationalizedValue[];
}

interface RegisteredTargetAttributes extends TargetAttributes {
  hreflang?: string[];
  media?: string;
  type?: string;
  title?: string;
  'title*'?: InternationalizedValue[];
};

type NormalizedTargetObject = {
  href: string;
} & TargetAttributes;

type NormalizedContextObject = {
  anchor: string;
} & {
  [rel: string]: NormalizedTargetObject[];
};

type NormalizedLinkset = {
  linkset: NormalizedContextObject[];
};

interface LinkInterface {
  anchor: string;
  rel: string;
  href: string;
  attributes: RegisteredTargetAttributes;
}

interface LinksetInterface {
  elements: LinkInterface[];
  hasLinkWithRel(relationType: string): boolean;
}

class Link implements LinkInterface {
  public anchor: string;
  public rel: string;
  public href: string;
  public attributes: RegisteredTargetAttributes;
  constructor(parameters) {
    const { anchor, rel, href, ...attributes } = parameters;
    this.anchor = anchor;
    this.rel = rel;
    this.href = href;
    this.attributes = attributes;
  }
}

class Linkset implements LinksetInterface {
  public elements: LinkInterface[];
  constructor(links: LinkInterface[]) {
    this.elements = links;
  }
  hasLinkWithRel(relationType: string): boolean {
    return this.elements.some((link) => link.rel === relationType);
  }
}

export function normalize(linkset: LinksetInterface): NormalizedLinkset {
  const contexts: {
    [anchor: string]: {
      [rel: string]: NormalizedTargetObject[];
    };
  } = {};
  linkset.elements.forEach(({ anchor, rel, ...target }) => {
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

export function denormalize(normalized: NormalizedLinkset): LinksetInterface {
  const links = [];
  normalized.linkset.forEach((contextObject) => {
    const { anchor, ...rels } = contextObject;
    Object.entries(rels).forEach(([rel, targetObjects]) => {
      targetObjects.forEach((targetObject) => {
        links.push(new Link({ anchor, rel, ...targetObject }));
      });
    });
  });
  return new Linkset(links);
}

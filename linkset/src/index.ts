type NormalizedTargetObject = {
  href: string;
} & {
  [attribute: string]: string | any[];
};

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
  attributes: {
    [name: string]: string | any[];
  };
}

interface LinksetInterface {
  elements: LinkInterface[];
  hasLinkWithRel(relationType: string): boolean;
}

class Link implements LinkInterface {
  public anchor: string;
  public rel: string;
  public href: string;
  public attributes: {
    [name: string]: string | any[];
  };
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
      [rel: string]: object[];
    };
  } = {};
  linkset.elements.forEach(({ anchor, rel, ...target }) => {
    if (!contexts.hasOwnProperty(anchor)) contexts[anchor] = {};
    if (!contexts[anchor].hasOwnProperty(rel)) contexts[anchor][rel] = [];
    contexts[anchor][rel].push({
      href: target.href,
      ...target.attributes,
    });
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

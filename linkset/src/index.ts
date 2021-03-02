type rawTargetObject = {
  href: string;
} & {
  [key: string]: string | any[];
}

type rawContextObject = {
  anchor: string;
} & {
  [key: string]: rawTargetObject[];
};

type rawLinkset = {
  linkset: rawContextObject[];
}

interface LinkInterface {
  anchor: string;
  rel: string;
  href: string;
  attributes: {
    [name: string]: string | any[]
  }
}

interface LinksetInterface {
  elements: LinkInterface[];
}

class Link implements LinkInterface {
  public anchor: string;
  public rel: string;
  public href: string;
  public attributes: {
    [name: string]: string | any[]
  };
  constructor(parameters) {
    const {anchor, rel, href, ...attributes} = parameters;
    this.anchor = anchor;
    this.rel = rel;
    this.href = href;
    this.attributes = attributes;
  }
}

class Linkset implements LinksetInterface {
  public elements: LinkInterface[];
  constructor(input: string | rawLinkset) {
    let setObject: rawLinkset;
    if (typeof input === 'string') {
      setObject = JSON.parse(input);
    }
    else {
      setObject = input;
    }
    const elements = [];
    setObject.linkset.forEach((contextObject) => {
      const { anchor, ...rels } = contextObject;
      Object.entries(rels).forEach(([rel, targetObjects]) => {
        targetObjects.forEach((targetObject) => {
          elements.push(new Link({anchor, rel, ...targetObject}));
        });
      })
    });
    this.elements = elements;
  }
}

export function fromJSON(input: string | rawLinkset): LinksetInterface {
  return new Linkset(input);
}

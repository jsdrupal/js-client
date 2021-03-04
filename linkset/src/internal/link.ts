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

export interface TargetAttributes extends RegisteredTargetAttributes {
  readonly [name: string]: string | string[] | InternationalizedValue[];
}

interface LinkParameters extends TargetAttributes {
  readonly anchor: string;
  readonly href: string;
  readonly rel: string;
}

export interface LinkInterface {
  readonly anchor: string;
  readonly rel: string;
  readonly href: string;
  readonly attributes: TargetAttributes;
}

export class Link implements LinkInterface {
  public anchor: string;
  public rel: string;
  public href: string;
  public attributes: TargetAttributes;
  constructor(parameters: LinkParameters) {
    const { anchor, rel, href, ...attributes } = parameters;
    this.anchor = anchor;
    this.rel = rel;
    this.href = href;
    this.attributes = attributes;
  }
}

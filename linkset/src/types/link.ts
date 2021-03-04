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

export interface LinkInterface {
  readonly anchor: string;
  readonly rel: string;
  readonly href: string;
  readonly attributes: TargetAttributes;
}

/**
 * A value object that represents a single, internationalized target attribute.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.4.2|draft-ietf-httpapi-linkset-00: Linkset §4.2.4.2}
 */
export type InternationalizedValue = {
  value: string;
  language?: string;
}

/**
 * An object that represent a single target attribute value.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.4|draft-ietf-httpapi-linkset-00: Linkset §4.2.4}
 */
export type TargetAttributeValue = string | InternationalizedValue;

/**
 * An object that represents a subset of a link's target attributes.
 * The subset's contents are the target attributes defined by Web Linking.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.4.1|draft-ietf-httpapi-linkset-00: Linkset §4.2.4.1}
 */
interface RegisteredTargetAttributes {
  readonly hreflang?: string[];
  readonly media?: string;
  readonly type?: string;
  readonly title?: string;
  readonly 'title*'?: InternationalizedValue[];
};

/**
 * An object that represents a link's target attributes.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.4|draft-ietf-httpapi-linkset-00: Linkset §4.2.4}
 */
export interface TargetAttributes extends RegisteredTargetAttributes {
  readonly [name: string]: TargetAttributeValue | TargetAttributeValue[];
}

/**
 * An object representing a link's parameters.
 * @internal
 */
interface LinkParameters extends TargetAttributes {
  /**
   * The link context.
   */
  readonly anchor: string;
  /**
   * The link relation type.
   */
  readonly rel: string;
  /**
   * The link target.
   */
  readonly href: string;
}

/**
 * An interface for a web link.
 * @see {@link https://tools.ietf.org/html/rfc8288#section-2|RFC 8288: Web Linking §2}
 */
export interface LinkInterface {
  /**
   * The link context.
   */
  readonly anchor: string;
  /**
   * The link relation type.
   * @see {@link https://tools.ietf.org/html/rfc8288#section-2.1|RFC 8288: Web Linking §2.1 Link Relation Types}
   */
  readonly rel: string;
  /**
   * The link target.
   */
  readonly href: string;
  /**
   * The link target attributes.
   */
  readonly attributes: TargetAttributes;
}

/**
 * A web link.
 * @internal
 */
export class Link implements LinkInterface {
  /**
   * {@inheritDoc LinkInterface.anchor}
   */
  public anchor: string;
  /**
   * {@inheritDoc LinkInterface.rel}
   */
  public rel: string;
  /**
   * {@inheritDoc LinkInterface.href}
   */
  public href: string;
  /**
   * {@inheritDoc LinkInterface.attributes}
   */
  public attributes: TargetAttributes;
  /**
   * Constructs a new link.
   * @param parameters - the link's parameters.
   * @see {@link LinkParameters}
   */
  constructor(parameters: LinkParameters) {
    const { anchor, rel, href, ...attributes } = parameters;
    this.anchor = anchor;
    this.rel = rel;
    this.href = href;
    this.attributes = attributes;
  }
}

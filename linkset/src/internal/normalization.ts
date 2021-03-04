import { TargetAttributes } from './link';

/**
 * An object that represents a link target object from the linkset spec.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.3|draft-ietf-httpapi-linkset-00: Linkset §4.2.3}
 */
export interface TargetObject extends TargetAttributes {
  href: string;
}

/**
 * An object that represents a link context object from the linkset spec.
 * @see {@link https://tools.ietf.org/html/draft-ietf-httpapi-linkset-00#section-4.2.2|draft-ietf-httpapi-linkset-00: Linkset §4.2.2}
 */
interface ContextObject {
  anchor: string;
  [rel: string]: TargetObject[];
}

/**
 * An object that conforms to the application/linkset+json media type spec.
 */
export interface LinkSetInterface {
  linkset: ContextObject[];
};

/**
 * Use for normalizing an object into a serializable object.
 * @internal
 * @typeParam T - A type that describes the result of normalization.
 */
export interface Normalizable<T> {
  normalize(): T;
}

import { TargetAttributes } from './link';

interface TargetObject extends TargetAttributes {
  href: string;
}

export interface LinkSetInterface {
  linkset: {
    anchor: string;
    [rel: string]: TargetObject[];
  }[];
};

export interface Normalizable<T> {
  normalize(): T;
}

import { TargetAttributes } from './link';

type TargetObject = { href: string } & TargetAttributes;

type LinkSet = {
  linkset: {
    anchor: string;
    [rel: string]: TargetObject[];
  }[];
};

export default LinkSet;

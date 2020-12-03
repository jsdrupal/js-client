import { DrupalEntity, DrupalEntityAttributes } from './Entity';

export interface DrupalNodeAttributes extends DrupalEntityAttributes {
  created: string;
  path: {
    alias: string;
  };
  title: string;
}

export interface DrupalNode extends DrupalEntity {
  id: string;
  type: string;
  attributes: DrupalNodeAttributes;
}

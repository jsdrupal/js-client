import { DrupalEntity, DrupalEntityAttributes } from './Entity';

interface DrupalFileAttributes extends DrupalEntityAttributes {
  filename: string;
  uri: {
    url: string;
  };
  filemime: string;
  created: string;
}

export interface DrupalFile extends DrupalEntity {
  attributes: DrupalFileAttributes;
}

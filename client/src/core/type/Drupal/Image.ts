import { DrupalFile } from './File';

export interface DrupalImage extends DrupalFile {
  meta: {
    alt: string;
    title: string;
    width: number;
    height: number;
  };
}

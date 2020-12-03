export interface DrupalEntityAttributes {
  langcode: string;
}

export interface DrupalEntity {
  id: string;
  type: string;
  attributes: DrupalEntityAttributes;
}

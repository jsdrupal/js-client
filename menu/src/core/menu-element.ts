import type { LinkInterface } from '@jsdrupal/linkset';

export interface MenuElementInterface {
  readonly title?: string;
  readonly link: LinkInterface
  readonly children: MenuElementInterface[];
}

type MenuLink = {
  attributes: {
    ['drupal-menu-machine-name']: string[];
    ['drupal-menu-hierarchy']: string[];
  }
} & LinkInterface;

export class MenuElement implements MenuElementInterface {
  readonly link: LinkInterface;
  readonly children: MenuElementInterface[];
  constructor(link: MenuLink, children: MenuLink[] = []) {
    this.link = link;
    this.children = buildTree([...children]);
  }
  get title(): string | undefined {
    return this.link.attributes.title;
  }
}

export function buildTree(links: MenuLink[]): MenuElement[] {
  // If there aren't any links or there is only one link, take a shortcut and return early.
  if (links.length < 2) {
    return links.length ? [new MenuElement(links.shift())] : [];
  }
  // Sorting by the hierarchy key is essential to capture link order and for the algorithm below to correctly build
  // subtrees.
  links.sort((a: MenuLink, b: MenuLink): number => {
    return a.attributes['drupal-menu-hierarchy'][0].localeCompare(b.attributes['drupal-menu-hierarchy'][0]);
  });
  const elements = [];
  let last;
  let children = [];
  do {
    const curr = links.shift();
    if (last) {
      if (curr.attributes['drupal-menu-hierarchy'][0].length > last.attributes['drupal-menu-hierarchy'][0].length) {
        children.push(curr);
      } else {
        elements.push(new MenuElement(last, children));
        last = curr;
        children = [];
      }
    } else {
      last = curr;
    }
  } while (links.length);
  elements.push(new MenuElement(last, children));
  return elements;
}

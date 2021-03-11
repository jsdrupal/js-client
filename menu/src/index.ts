import { Menu } from './core/menu';
import type { MenuInterface, NormalizedMenuInterface } from './core/menu';
import type { MenuElementInterface } from './core/menu-element';

/**
 * Denormalizes a set of links into an instance of a Menu.
 * {@inheritDoc Menu.from}
 * {@see {@link NormalizedMenuInterface}}
 */
function denormalize(normalized: NormalizedMenuInterface, menuID?: string): Menu | Menu[] {
  return Menu.from(normalized, menuID);
}

/**
 * Parses Drupal menu JSON into a Menu instance.
 * {@see {@link denormalize}}
 */
function parse(json: string, menuID?: string): Menu | Menu[] {
  return denormalize(JSON.parse(json), menuID);
}

export {
  parse,
  denormalize,
  MenuInterface,
  MenuElementInterface,
  NormalizedMenuInterface,
};

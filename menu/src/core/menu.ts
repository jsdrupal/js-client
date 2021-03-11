import { denormalize } from '@jsdrupal/linkset';
import type { LinkInterface, NormalizedLinksetInterface, LinksetInterface } from '@jsdrupal/linkset';
import { buildTree, MenuElement } from './menu-element';
import type { MenuElementInterface } from './menu-element';
import { TargetAttributeValue } from '../../../linkset/src/core/link';

export interface MenuInterface extends LinksetInterface {
  readonly id: string;
  readonly tree: MenuElementInterface[];
}

export type NormalizedMenuInterface = NormalizedLinksetInterface;

export class Menu implements MenuInterface {
  readonly id: string;
  readonly tree: MenuElement[];
  readonly elements: LinkInterface[];
  readonly size: number;
  private linkset: LinksetInterface;
  constructor(machineName: string, linkset: LinksetInterface) {
    this.id = machineName;
    this.linkset = linkset;
    this.elements = this.linkset.elements;
    this.size = this.linkset.size;
    this.tree = buildTree([...this.elements]);
  }
  /**
   * {@inheritDoc LinksetInterface.hasLinkTo}
   */
  hasLinkTo(relationType: string): boolean {
    return this.linkset.hasLinkTo(relationType);
  }
  /**
   * {@inheritDoc LinksetInterface.linkTo}
   */
  linkTo(relationType: string): LinkInterface | undefined {
    return this.linkset.linkTo(relationType);
  }
  /**
   * {@inheritDoc LinksetInterface.linksTo}
   */
  linksTo(relationType: string): Menu {
    return new Menu(this.id, this.linkset.linksTo(relationType));
  }
  /**
   * {@inheritDoc LinksetInterface.linksFrom}
   */
  linksFrom(anchor: string): Menu {
    return new Menu(this.id, this.linkset.linksTo(anchor));
  }
  /**
   * {@inheritdoc LinksetInterface.linksWithAttribute}
   */
  linksWithAttribute(name: string): Menu {
    return new Menu(this.id, this.linkset.linksWithAttribute(name));
  }
  /**
   * {@inheritdoc LinksetInterface.linksWithAttributeValue}
   */
  linksWithAttributeValue(name: string, value: TargetAttributeValue): Menu {
    return new Menu(this.id, this.linkset.linksWithAttributeValue(name, value));
  }
  /**
   * Creates a new menu from a normalized linkset.
   * @param normalized
   *   A normalized linkset.
   * @param menuID
   *   A menu machine name.o
   * @returns a new Menu object containing only link elements belonging to the given menu.
   */
  static from(normalized: NormalizedMenuInterface, menuID?: string): Menu | Menu[] {
    const linkset = denormalize(normalized);
    const machineNames: string[] = [];
    if (!menuID) {
      linkset.linksWithAttribute('drupal-menu-machine-name').elements.forEach((link: LinkInterface) => {
        if (!machineNames.includes(link.attributes["drupal-menu-machine-name"][0])) {
          machineNames.push(link.attributes["drupal-menu-machine-name"][0]);
        }
      });
    } else {
      machineNames.push(menuID);
    }
    const menus = machineNames.map((machineName ) => {
      return new Menu(machineName, linkset.linksWithAttributeValue('drupal-menu-machine-name', machineName));
    });
    return menuID ? menus.shift() : menus;
  }
}


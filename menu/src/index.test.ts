import { parse, denormalize, MenuInterface } from './index';
import { readFileSync } from 'fs';

const examples = {
  'Main menu': readFileSync(__dirname + '/main-menu.json').toString(),
  'Combined menu': readFileSync(__dirname + '/combined-menu.json').toString(),
  'Contextual menu': readFileSync(__dirname + '/contextual-menu.json').toString(),
};

describe.each(Object.entries(examples))('parse()', (label, sample) => {
 test(`${label} does not fail`, () => {
   parse(sample);
 })
})

describe('denormalize()', () => {
  it('should return a single menu array when parsing the main menu', () => {
   const menus = denormalize(JSON.parse(examples['Main menu']));
   expect(Array.isArray(menus)).toBe(true);
   expect((menus as Array<MenuInterface>).length).toBe(1);
  });
  it('should return a menu with a correctly structured tree', () => {
   const menu = denormalize(JSON.parse(examples['Main menu']), 'main') as MenuInterface;
   expect(menu.tree[0].title).toBe('Home');
   expect(menu.tree[1].title).toBe('About us');
   expect(menu.tree[1].children[0].title).toBe('Our name');
  });
  it('should return a single menu when parsing the main menu and passing a menu ID', () => {
   const menus = denormalize(JSON.parse(examples['Main menu']), 'main');
   expect(Array.isArray(menus)).toBe(false);
  });
  it('should return two menus when parsing the combined menu', () => {
   const menus = denormalize(JSON.parse(examples['Combined menu']));
   expect(Array.isArray(menus)).toBe(true);
   expect((menus as Array<MenuInterface>).length).toBe(2);
  });
  it('should return a single menu when parsing the combined menu and passing a menu ID', () => {
   const menus = denormalize(JSON.parse(examples['Combined menu']), 'account');
   expect(Array.isArray(menus)).toBe(false);
  });
  it('should return a single menu when parsing the contextual menu and passing a menu ID', () => {
   const menus = denormalize(JSON.parse(examples['Combined menu']), 'account');
   expect(Array.isArray(menus)).toBe(false);
  });
  it('should return an account menu and a main menu when parsing the contextual menu', () => {
   const menus = denormalize(JSON.parse(examples['Contextual menu'])) as Array<MenuInterface>;
   expect(menus[0].tree[0].link.attributes['drupal-menu-machine-name'][0]).toBe('account');
   expect(menus[1].tree[0].link.attributes['drupal-menu-machine-name'][0]).toBe('main');
  });
  it('should return a correctly ordered menu from the contextual account menu', () => {
    const menu = denormalize(JSON.parse(examples['Contextual menu']), 'account') as MenuInterface;
    expect(menu.tree[0].title).toBe('Log out');
    expect(menu.tree[1].title).toBe('My profile');
  });
});

// vim: set nowrap:

import { normalize, denormalize } from './index';

const figure4 = `{"linkset":[{"anchor":"https://example.org/article/view/7507","author":[{"href":"https://orcid.org/0000-0002-1825-0097"}],"item":[{"href":"https://example.org/article/7507/item/1","type":"application/pdf"},{"href":"https://example.org/article/7507/item/2","type":"text/csv"}],"cite-as":[{"href":"https://doi.org/10.5555/12345680","title":"AMethodologyfortheEmulationofArchitecture"}]},{"anchor":"https://example.com/links/article/7507","alternate":[{"href":"https://mirror.example.com/links/article/7507","type":"application/linkset"}]}]}`;

const section_4_2_4_1 = `{"linkset":[{"anchor":"http://example.net/bar","next":[{"href":"http://example.com/foo","type":"text/html","hreflang":["en","de"]}]}]}`;

test('normalize()', () => {
  const linkset = denormalize(JSON.parse(figure4));
  const json = JSON.stringify(normalize(linkset));
  expect(json).toBe(figure4);
});

describe('denormalize()', () => {
  const paramFilter = (name, value) => (link) => link[name] === value;
  const linkset = denormalize(JSON.parse(figure4));

  it('should have a total of 5 links', () => {
    expect(linkset.elements.length).toBe(5);
  });

  it('should have two contexts, with 4 and 1 link each', () => {
    expect(linkset.elements.filter(paramFilter('anchor', 'https://example.org/article/view/7507')).length).toBe(4);
    expect(linkset.elements.filter(paramFilter('anchor', 'https://example.com/links/article/7507')).length).toBe(1);
  });

  it('should have the correct number of links by link relation type', () => {
    expect(linkset.elements.filter(paramFilter('rel', 'author')).length).toBe(1);
    expect(linkset.elements.filter(paramFilter('rel', 'item')).length).toBe(2);
    expect(linkset.elements.filter(paramFilter('rel', 'cite-as')).length).toBe(1);
    expect(linkset.elements.filter(paramFilter('rel', 'alternate')).length).toBe(1);
  });

  it('should have the correct href and attributes for a given link relation type', () => {
    const items = linkset.elements.filter(paramFilter('rel', 'item'));
    expect(items[0].href).toBe('https://example.org/article/7507/item/1');
    expect(items[0].attributes.type).toBe('application/pdf');
    expect(items[1].href).toBe('https://example.org/article/7507/item/2');
    expect(items[1].attributes.type).toBe('text/csv');
  });

  it('should be able to denormalize registered target attributes', () => {
    const actual = denormalize(JSON.parse(section_4_2_4_1));
    expect(actual.elements.length).toBe(1);
    const link = actual.elements[0];
    expect(link.anchor).toBe('http://example.net/bar');
    expect(link.rel).toBe('next');
    expect(link.href).toBe('http://example.com/foo');
    expect(link.attributes.type).toBe('text/html');
    expect(link.attributes.hreflang[0]).toBe('en');
    expect(link.attributes.hreflang[1]).toBe('de');
  });
});

describe('Linkset', () => {
  const linkset = denormalize(JSON.parse(figure4));
  it('should be able to indicate whether a link with a particular link relation is in the set of links', () => {
    expect(linkset.linksTo('author')).toBe(true);
    expect(linkset.linksTo('next')).toBe(false);
  });
});

// vim: set nowrap:

import { parse, denormalize } from './index';

const examples = {
  'Figure 4': `{"linkset":[{"anchor":"https://example.org/article/view/7507","author":[{"href":"https://orcid.org/0000-0002-1825-0097"}],"item":[{"href":"https://example.org/article/7507/item/1","type":"application/pdf"},{"href":"https://example.org/article/7507/item/2","type":"text/csv"}],"cite-as":[{"href":"https://doi.org/10.5555/12345680","title":"AMethodologyfortheEmulationofArchitecture"}]},{"anchor":"https://example.com/links/article/7507","alternate":[{"href":"https://mirror.example.com/links/article/7507","type":"application/linkset"}]}]}`,
  'Section 4.2.4.1': `{"linkset":[{"anchor":"http://example.net/bar","next":[{"href":"http://example.com/foo","type":"text/html","hreflang":["en","de"]}]}]}`,
  'Section 4.2.4.2': `{"linkset":[{"anchor":"http://example.net/bar","next":[{"href":"http://example.com/foo","type":"text/html","hreflang":["en","de"],"title":"Next chapter","title*":[{"value":"nachstes Kapitel","language":"de"}]}]}]}`,
};

describe('Linkset', () => {
  const linkset = denormalize(JSON.parse(examples['Figure 4']));
  it('should be able to indicate whether a link with a given link relation is in the set of links', () => {
    expect(linkset.hasLinkTo('author')).toBe(true);
    expect(linkset.hasLinkTo('next')).toBe(false);
  });
  it('should be able to return an array of links for a given link relation', () => {
    expect(linkset.linksTo('item').size).toBe(2);
    expect(linkset.linksTo('author').size).toBe(1);
    expect(linkset.linksTo('next').size).toBe(0);
  });
  it('should be able to return the first link for a given link relation', () => {
    expect(linkset.linkTo('item').href).toBe('https://example.org/article/7507/item/1');
  });
  it('should return undefined if a single link with a given link relation is not available', () => {
    expect(linkset.linkTo('next')).toBe(undefined);
  });
  it('should be able to return a new linkset containing only links for a given anchor', () => {
    expect(linkset.linksFrom('https://example.org/article/view/7507').size).toBe(4);
    expect(linkset.linksFrom('https://example.com/links/article/7507').size).toBe(1);
  });
  it('should be iterable and re-iterable', () => {
    expect(Array.from(linkset).length).toBe(5);
    expect(Array.from(linkset).length).toBe(5);
  });
  it('should be re-normalizable', () => {
    const linkset = denormalize(JSON.parse(examples['Figure 4']));
    expect(JSON.stringify(linkset.normalize())).toBe(examples['Figure 4']);
  });
});

describe('denormalize()', () => {
  const linkset = denormalize(JSON.parse(examples['Figure 4']));

  it('should return a Linkset with total of 5 links', () => {
    expect(linkset.size).toBe(5);
  });

  it('should return a Linkset with two contexts, one with 4 links nd another 1 link', () => {
    expect(linkset.linksFrom('https://example.org/article/view/7507').size).toBe(4);
    expect(linkset.linksFrom('https://example.com/links/article/7507').size).toBe(1);
  });

  it('should have the correct number of links by link relation type', () => {
    expect(linkset.linksTo('author').size).toBe(1);
    expect(linkset.linksTo('item').size).toBe(2);
    expect(linkset.linksTo('cite-as').size).toBe(1);
    expect(linkset.linksTo('alternate').size).toBe(1);
  });

  it('should have the correct href and attributes for a given link relation type', () => {
    const items = Array.from(linkset.linksTo('item'));
    expect(items[0].href).toBe('https://example.org/article/7507/item/1');
    expect(items[0].attributes.type).toBe('application/pdf');
    expect(items[1].href).toBe('https://example.org/article/7507/item/2');
    expect(items[1].attributes.type).toBe('text/csv');
  });

  it('should be able to denormalize registered target attributes', () => {
    const actual = denormalize(JSON.parse(examples['Section 4.2.4.1']));
    expect(actual.size).toBe(1);
    const link = Array.from(actual).pop();
    expect(link.anchor).toBe('http://example.net/bar');
    expect(link.rel).toBe('next');
    expect(link.href).toBe('http://example.com/foo');
    expect(link.attributes.type).toBe('text/html');
    expect(link.attributes.hreflang[0]).toBe('en');
    expect(link.attributes.hreflang[1]).toBe('de');
  });

  it('should be able to denormalize internationalized target attributes', () => {
    const actual = denormalize(JSON.parse(examples['Section 4.2.4.2']));
    expect(actual.size).toBe(1);
    const link = Array.from(actual).pop();
    expect(link.anchor).toBe('http://example.net/bar');
    expect(link.rel).toBe('next');
    expect(link.href).toBe('http://example.com/foo');
    expect(link.attributes.type).toBe('text/html');
    expect(link.attributes.hreflang[0]).toBe('en');
    expect(link.attributes.hreflang[1]).toBe('de');
    expect(link.attributes.title).toBe('Next chapter');
    expect(link.attributes['title*'][0].value).toBe('nachstes Kapitel');
    expect(link.attributes['title*'][0].language).toBe('de');
  });
});

describe.each(Object.entries(examples))('parse()', (label, sample) => {
  test(`${label} does not fail and can be renormalized`, () => {
    expect(JSON.stringify(parse(sample).normalize())).toBe(sample);
  })
})

// vim: set nowrap:

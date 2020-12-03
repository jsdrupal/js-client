import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const docsDirectory = join(process.cwd(), 'content');

const getBySlug = (slug) => {
  const file = fs.readFileSync(join(docsDirectory, `${slug}.md`), 'utf8');
  const { data, content } = matter(file);
  return {
    slug,
    frontmatter: data,
    title: data.title,
    content,
  };
};

const getAllSlugs = () => {
  const slugs = fs.readdirSync(docsDirectory);
  return slugs.map((slug) => `${slug.substr(0, slug.indexOf('.md'))}`);
};

export { getBySlug, getAllSlugs };

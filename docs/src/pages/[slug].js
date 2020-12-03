import remark from 'remark'
import html from 'remark-html'
import { getAllSlugs, getBySlug } from '../lib/docs';
import Head from "next/head";

function Doc ({ title, content }) {
    return (
        <div className="container">
            <Head>
                <title>{ title } | Documentation</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
            </Head>
            <h1>{ title }</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
            <style jsx global>{`
                h1 {
                  margin-bottom: 5rem;
                }
                img {
                  max-width: 100%;
                  border: 1px solid black;
                  margin: 2.5rem 0;
                }
                .container {
                  margin: 1rem;
                  font-family: 'Roboto', sans-serif;
                }
                p {
                  margin-bottom: 1rem;
                  line-height: 1.5;
                }
          `}</style>
        </div>
    );
}

export async function getStaticProps({ params }) {
    const doc = getBySlug(params.slug)
    const markdown = await remark()
        .use(html)
        .process(doc.content || '')
    const content = markdown.toString()

    return {
        props: {
            ...doc,
            content,
        },
    };
};

export async function getStaticPaths() {
    const slugs = getAllSlugs();

    return {
        paths: slugs.map(slug => {
            return {
                params: {
                    slug: slug,
                },
            }
        }),
        fallback: false,
    };
}
export default Doc;
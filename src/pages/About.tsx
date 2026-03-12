import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TITLE } from '../App';

const aboutMd: string = await fetch(`${import.meta.env.BASE_URL}data/about.md`).then(
  (r) => r.text()
);

export default function About() {
  useEffect(() => {
    document.title = `关于本站 - ${TITLE}`;
  }, []);

  return (
    <article id="doc-viewer">
      <ReactMarkdown>{aboutMd}</ReactMarkdown>
    </article>
  );
}

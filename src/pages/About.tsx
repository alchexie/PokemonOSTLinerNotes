import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { TITLE } from '@/App';
import text from '@/data/about.md?raw';

export default function About() {
  useEffect(() => {
    document.title = `关于本站 - ${TITLE}`;
  }, []);

  return (
    <article id="doc-viewer">
      <ReactMarkdown>{text}</ReactMarkdown>
    </article>
  );
}

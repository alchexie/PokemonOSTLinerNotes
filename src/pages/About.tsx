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
      <ReactMarkdown
        components={{
          a: ({ href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </article>
  );
}

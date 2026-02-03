import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ContentSection } from '../types';

export default function DocViewer({
  loading,
  sections,
}: {
  loading: boolean;
  sections: ContentSection[];
}) {
  const manageContent = (content: string): string => {
    return content.replace(/\*\*([\s\S]*?)\*\*/g, (m) => m.replace(/ \| /g, '\n'));
  };

  return (
    <article id="doc-viewer">
      {loading && <div>Loading...</div>}
      {!loading &&
        sections.map((section) => (
          <section key={section.key}>
            <h2 id={section.key}>{section.title}</h2>
            {section.files.map((file) => (
              <React.Fragment key={file.key}>
                <h3 id={file.key}>{file.title}</h3>
                <ReactMarkdown>{manageContent(file.content)}</ReactMarkdown>
              </React.Fragment>
            ))}
          </section>
        ))}
    </article>
  );
}

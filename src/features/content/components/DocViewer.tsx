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
  return (
    <article>
      {loading && <div>Loading...</div>}
      {!loading &&
        sections.map((section) => (
          <section key={section.key}>
            <h2>{section.title}</h2>
            {section.files.map((file) => (
              <React.Fragment key={file.title}>
                <h3>{file.title}</h3>
                <ReactMarkdown>{file.content}</ReactMarkdown>
              </React.Fragment>
            ))}
          </section>
        ))}
    </article>
  );
}

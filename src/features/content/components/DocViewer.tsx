import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { ContentSection } from '../types';
import { formatMarkdownContent } from '../utils/formatter';
import { useHashScroll } from '../hooks/useHashScroll';
import { useCopyWithSource } from '../hooks/useCopyWithSource';

export default function DocViewer({
  loading,
  sections,
}: {
  loading: boolean;
  sections: ContentSection[];
}) {
  const articleRef = useCopyWithSource();
  useHashScroll(sections);

  return (
    <article id="doc-viewer" ref={articleRef}>
      {loading && <div>Loading...</div>}
      {!loading &&
        sections.map((section) => (
          <section key={section.key}>
            <h2 id={section.key}>{section.title}</h2>
            {section.files.map((file) => (
              <React.Fragment key={file.key}>
                <h3 id={file.key}>{file.title}</h3>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {formatMarkdownContent(file.content, file.meta.diff_colors)}
                </ReactMarkdown>
              </React.Fragment>
            ))}
          </section>
        ))}
    </article>
  );
}

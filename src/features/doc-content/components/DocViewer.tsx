import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { ContentGroup } from '../types';
import { formatMarkdownContent } from '../utils/formatMarkdownContent';
import { useHashScroll } from '../hooks/useHashScroll';
import { useCopyWithSource } from '../hooks/useCopyWithSource';
import createTrackPopupTrigger from '../utils/createTrackPopupTrigger';

export default function DocViewer({ current }: { current: ContentGroup }) {
  const component = useMemo(() => createTrackPopupTrigger(current), [current]);
  const articleRef = useCopyWithSource();
  useHashScroll(current.sections);

  return (
    <article id="doc-viewer" ref={articleRef}>
      {current.sections.map((section) => (
        <section key={section.key}>
          <h2 id={section.key}>{section.title}</h2>
          {section.files.map((file) => (
            <React.Fragment key={file.key}>
              <h3 id={file.key}>{file.title}</h3>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{ strong: component }}
              >
                {formatMarkdownContent(file.content, file.meta.diff_colors)}
              </ReactMarkdown>
            </React.Fragment>
          ))}
        </section>
      ))}
    </article>
  );
}

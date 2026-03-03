import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { ContentGroup } from '../types';
import { formatMarkdownContent } from '../utils/formatter';
import { useHashScroll } from '../hooks/useHashScroll';
import { useCopyWithSource } from '../hooks/useCopyWithSource';
import { createTrackPopup } from './TrackPopup';

export default function DocViewer({ current }: { current: ContentGroup }) {
  const articleRef = useCopyWithSource();
  useHashScroll(current.sections);
  const component = useMemo(() => createTrackPopup(current), [current]);

  return (
    <article id="doc-viewer" ref={articleRef}>
      {current.sections.map((section) => (
        <section key={section.key}>
          <h2 id={section.key}>{section.title}</h2>
          {section.files.map((file) => (
            <React.Fragment key={file.key}>
              <h3 id={file.key}>{file.title}</h3>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} components={{ em: component }}>
                {formatMarkdownContent(file.content, file.meta.diff_colors)}
              </ReactMarkdown>
            </React.Fragment>
          ))}
        </section>
      ))}
    </article>
  );
}

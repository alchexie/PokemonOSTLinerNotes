import React, { useMemo, useState } from 'react';
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
                components={{
                  strong: component,
                  a: (props) => <DocLink {...props} />,
                  img: (props) => <DocImage {...props} />,
                }}
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

function DocLink({
  href,
  target,
  rel,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isAbsoluteHref = /^http/.test(href ?? '');
  const finalTarget = isAbsoluteHref ? '_blank' : target;
  const finalRel = isAbsoluteHref ? 'noopener noreferrer' : rel;
  return <a href={href} target={finalTarget} rel={finalRel} {...rest} />;
}

function DocImage({
  src,
  alt,
  onLoad,
  onError,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return null;
  }

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    setFailed(true);
    onError?.(event);
  };

  const handleClick = () => {
    if (!loaded) return;
    const opened = window.open(src, '_blank', 'noopener,noreferrer');
    if (opened) {
      opened.opener = null;
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      onClick={handleClick}
      data-clickable={loaded ? 'true' : 'false'}
      {...rest}
    />
  );
}

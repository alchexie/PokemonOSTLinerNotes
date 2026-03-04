import React from 'react';
import type { ContentGroup } from '../types';
import TrackPopupTrigger from '../components/TrackPopupTrigger';

interface ReactElementProps {
  children?: React.ReactNode;
}

export default function createTrackPopupTrigger(current: ContentGroup) {
  return function ({ children }: ReactElementProps) {
    const [label, em] = React.Children.toArray(children);
    if (
      typeof label === 'string' &&
      React.isValidElement<{ children?: React.ReactNode }>(em) &&
      em.type === 'em'
    ) {
      const raw = React.Children.toArray(em.props.children).map(String).join(' ');
      const tokens = raw.trim().split(/\s+/);
      const indexes = tokens.map((x) => (/^\d/.test(x) ? `${current.key}-${x}` : x));

      return (
        <TrackPopupTrigger label={label} groupKey={current.key} trackIndexes={indexes} />
      );
    } else {
      return <strong>{children}</strong>;
    }
  };
}

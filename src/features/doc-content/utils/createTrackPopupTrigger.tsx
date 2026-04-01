import React, { type ReactNode } from 'react';
import type { ContentSeries } from '@/types';
import TrackPopupTrigger from '../components/TrackPopupTrigger';

export const createTrackPopupTrigger = (current: ContentSeries) => {
  return function ({ children }: { children?: ReactNode }) {
    const [label, em] = React.Children.toArray(children);
    if (
      typeof label === 'string' &&
      React.isValidElement<{ children?: React.ReactNode }>(em) &&
      em.type === 'em'
    ) {
      const raw = React.Children.toArray(em.props.children).map(String).join(' ');
      const tokens = raw.trim().split(/\s+/);
      const indexes = tokens.map((x) => (/^\d/.test(x) ? `${current.key}-${x}` : x));

      return <TrackPopupTrigger label={label} trackIndexes={indexes} />;
    } else {
      return <strong>{children}</strong>;
    }
  };
};

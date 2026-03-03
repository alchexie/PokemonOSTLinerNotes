import React from 'react';
import type { ContentGroup } from '../types';

type TrackInfoProps = {
  groupKey: string;
  trackIndexes: string[];
};

const trackInfo: Record<string, string[][]> = await fetch(
  `${import.meta.env.BASE_URL}data/track_info.json`
).then((r) => r.json());

export function TrackInfo({ groupKey, trackIndexes }: TrackInfoProps) {
  return (
    <span className="track-info">
      {trackIndexes.map((index, idx) => {
        const [key, trackIndex] = index.split('-');
        const track = trackInfo[key].find((x) =>
          x.slice(0, 2).includes(trackIndex.replace('+', ''))
        )!;

        return (
          <span key={idx}>
            {/* <button key={index}>{index}</button> */}
            <span>{`${key === groupKey ? '' : `[${key}]-`}${track[0]} (${track[1]}) - ${track[2]}${trackIndex.includes('+') ? `【${track[3]}】` : ''}`}</span>
          </span>
        );
      })}
    </span>
  );
}

export const createTrackPopup = (current: ContentGroup) => {
  return function ({ children }: any) {
    const text = React.Children.toArray(children).join('');
    const tokens = text.split(/\s+/);
    const isTrack = tokens.every((t) =>
      /^(?:\d+(?:\.\d+)?|[A-Za-z]+-\d+(?:\.\d+)?)\+?$/.test(t)
    );

    if (!isTrack) {
      return <em>{children}</em>;
    }
    const indexes = tokens.map((x) => (/^\d/.test(x) ? `${current.key}-${x}` : x));
    return <TrackInfo groupKey={current.key} trackIndexes={indexes} />;
  };
};

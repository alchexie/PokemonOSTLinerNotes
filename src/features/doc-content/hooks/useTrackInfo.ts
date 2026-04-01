import { useEffect, useState } from 'react';

type TrackInfo = Record<string, string[][]>;

let trackInfoCache: TrackInfo | null = null;
let loadingPromise: Promise<TrackInfo> | null = null;

const getTrackInfo = async (): Promise<TrackInfo> => {
  if (trackInfoCache) return trackInfoCache;
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch(`${import.meta.env.BASE_URL}data/track_info.json`)
    .then((res) => res.json())
    .then((data) => {
      trackInfoCache = data;
      return data;
    });
  return loadingPromise;
};

export function useTrackInfo() {
  const [trackInfo, setTrackInfo] = useState<TrackInfo | null>(null);

  useEffect(() => {
    getTrackInfo()
      .then((data) => {
        setTrackInfo(data);
      })
      .catch(() => {
        setTrackInfo(null);
      });
  }, []);

  return trackInfo;
}

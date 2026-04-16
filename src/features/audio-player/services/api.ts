import { CONTENT_SERIES_LIST } from '@/services/content-repository';
import type { Audio } from '../types';

type VgmTrackInfo = Record<string, string>;

const albumMap = new Map<string, string>();
const trackMap = new Map<string, VgmTrackInfo>();

export const getTrackInfoFromVgm = async (track: Audio): Promise<VgmTrackInfo> => {
  const trackKey = `${track.ostSeries}-${track.indexDisc}`;

  if (trackMap.has(trackKey)) {
    return trackMap.get(trackKey)!;
  } else {
    const [discNumber, trackNumber] = track.indexDisc.split('.');
    const params = {
      album: (() => {
        const key = track.ostSeries;
        if (albumMap.has(key)) {
          return albumMap.get(key)!;
        } else {
          const album = CONTENT_SERIES_LIST.find((x) => x.key === key)!.meta['album_en'];
          albumMap.set(key, album);
          return album;
        }
      })(),
      discNumber: discNumber,
      trackNumber: (+trackNumber).toString(),
    };

    const res = await fetch(
      `${import.meta.env.BASE_URL}api/tracks/search?${new URLSearchParams(params).toString()}`
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
    const result = (await res.json()).items[0] as VgmTrackInfo;
    trackMap.set(trackKey, result);
    return result;
  }
};

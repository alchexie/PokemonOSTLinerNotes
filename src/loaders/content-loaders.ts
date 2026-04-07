import type { ContentSeries } from '@/types';
import { SERIES_KEYS } from './types';

const loadSeriesBundle = async (ostSeries: string): Promise<ContentSeries> => {
  const cacheBust = __BUILD_ID__;
  const res = await fetch(
    `${import.meta.env.BASE_URL}/data/docs/${ostSeries}.json?v=${cacheBust}`
  );
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Failed to load series bundle: ${ostSeries}`);
  }
  return res.json();
};

export const contentLoaders: Record<string, () => Promise<ContentSeries>> =
  Object.fromEntries(SERIES_KEYS.map((key) => [key, () => loadSeriesBundle(key)]));

import type { ContentGroup } from '../features/doc-content/types';
import { SERIES_KEYS } from './types';

const loadSeriesBundle = async (ostSeries: string): Promise<ContentGroup> => {
  const res = await fetch(`${import.meta.env.BASE_URL}/data/docs/${ostSeries}.json`);
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Failed to load series bundle: ${ostSeries}`);
  }
  return res.json();
};

export const contentLoaders: Record<string, () => Promise<ContentGroup>> = Object.fromEntries(
  SERIES_KEYS.map((key) => [key, () => loadSeriesBundle(key)])
);

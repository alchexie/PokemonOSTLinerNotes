const seriesMetaModules = import.meta.glob('/docs/**/_meta.json', {
  eager: true,
  import: 'default',
});

export const SERIES_KEYS = Object.keys(seriesMetaModules)
  .filter((x) => x.split('/').length === 4)
  .sort()
  .map((x) => x.split('/')[2].split('-').pop()!);

export type SeriesKey = (typeof SERIES_KEYS)[number];

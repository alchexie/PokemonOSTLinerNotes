import type { ContentSeries, ContentMeta } from '@/types';
import { contentLoaders } from '@/loaders/content-loaders';

const loadSeriesMetaList = (): ContentSeries[] => {
  const sectionMetaModules = import.meta.glob('/docs/**/_meta.json', {
    eager: true,
    import: 'default',
  }) as Record<string, ContentMeta>;
  const seriesMetaModules = Object.fromEntries(
    Object.entries(sectionMetaModules).filter(([key]) => key.split('/').length === 4)
  );

  const seriesList: ContentSeries[] = Object.entries(seriesMetaModules)
    .map(([metaPath, meta]) => {
      const folder = metaPath.split('/')[2];
      return {
        key: folder.split('-').pop()!,
        title: meta?.title ?? folder,
        meta,
        sections: [],
      };
    })
    .reverse();

  return seriesList;
};
const contentCache = new Map<string, ContentSeries>();

export const loadContentByOstSeries = async (
  ostSeries: string
): Promise<ContentSeries | null> => {
  if (contentCache.has(ostSeries)) {
    return contentCache.get(ostSeries)!;
  }

  const loader = contentLoaders[ostSeries];
  if (!loader) {
    return null;
  }

  const content = await loader();
  contentCache.set(ostSeries, content);
  return content;
};

export const CONTENT_SERIES_LIST = loadSeriesMetaList().map((meta) => ({
  key: meta.key,
  title: meta.title,
  meta: meta.meta,
  sections: [],
})) as ContentSeries[];

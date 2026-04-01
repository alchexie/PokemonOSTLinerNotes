import type { ContentGroup, ContentMeta } from './types';
import { contentLoaders } from '@/loaders/content-loaders';

const loadSeriesMetaList = (): ContentGroup[] => {
  const sectionMetaModules = import.meta.glob('/docs/**/_meta.json', {
    eager: true,
    import: 'default',
  }) as Record<string, ContentMeta>;
  const seriesMetaModules = Object.fromEntries(
    Object.entries(sectionMetaModules).filter(([key]) => key.split('/').length === 4)
  );

  const groups: ContentGroup[] = Object.entries(seriesMetaModules)
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

  return groups;
};
const contentCache = new Map<string, ContentGroup>();

export const loadContentByOstSeries = async (
  ostSeries: string
): Promise<ContentGroup | null> => {
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

export const CONTENT_GROUPS = loadSeriesMetaList().map((meta) => ({
  key: meta.key,
  title: meta.title,
  meta: meta.meta,
  sections: [],
})) as ContentGroup[];

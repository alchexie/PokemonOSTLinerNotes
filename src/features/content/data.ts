import fm from 'front-matter';
import type { ContentGroup, ContentSection, ContentMeta } from './types';

const createContent = (): ContentGroup[] => {
  const mdModules = import.meta.glob('/docs/**/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>;
  const sectionMetaModules = import.meta.glob('/docs/**/_meta.json', {
    eager: true,
    import: 'default',
  }) as Record<string, ContentMeta>;
  const groupMetaModules = Object.fromEntries(
    Object.entries(sectionMetaModules).filter(([key]) => key.split('/').length === 4)
  );

  const groupMap: Map<string, string[]> = new Map(
    Object.keys(groupMetaModules).map((key) => [key.split('/')[2], []])
  );
  Object.keys(mdModules).forEach((path) => {
    const group = path.split('/docs/')[1].split('/')[0];
    const current = groupMap.get(group) ?? [];
    current.push(path);
    groupMap.set(group, current);
  });

  const groups: ContentGroup[] = [...groupMap.entries()].map(([folder, paths]) => {
    const groupMetaPath = `/docs/${folder}/_meta.json`;
    const groupMeta = groupMetaModules[groupMetaPath];
    const sectionMap: Map<string, ContentSection> = new Map<string, ContentSection>();

    for (const path of paths) {
      let [, section, filename] = path.split('/docs/')[1].split('/');

      if (!filename) {
        [section, filename] = ['', section];
      }

      const current =
        sectionMap.get(section) ??
        ({
          key: section,
          title: section.replace(/^\d+-/, ''),
          meta: {} as ContentMeta,
          files: [],
        } as ContentSection);

      const metaPath = path.replace(/\/[^/]+\.md$/, '/_meta.json');
      if (sectionMetaModules[metaPath]) {
        const meta = sectionMetaModules[metaPath];
        current.title = meta.title;
        current.meta = meta;
      }

      const raw = mdModules[path];
      const { attributes, body } = fm<ContentMeta>(raw);
      const strKey = filename.replace(/\.md$/, '');
      current.files.push({
        key: strKey,
        title: attributes.title ?? strKey.replace(/^\d+-/, ''),
        meta: attributes,
        content: body,
      });

      sectionMap.set(section, current);
    }

    return {
      key: folder.split('-').pop()!,
      title: groupMeta?.title ?? folder,
      meta: groupMeta,
      sections: [...sectionMap.values()],
    };
  });

  return groups.reverse();
};

export const CONTENT: ContentGroup[] = createContent();

export const TITLE: string = 'Pokemon OST Liner Notes';

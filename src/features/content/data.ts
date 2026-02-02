import fm from 'front-matter';
import type {
  ContentGroup,
  MdLoader,
  ContentSection,
  ContentMeta,
  MetaLoader,
} from './types';

const createContent = (): ContentGroup[] => {
  const mdModules = import.meta.glob('/docs/**/*.md', {
    query: '?raw',
    import: 'default',
  }) as Record<string, MdLoader>;
  const sectionMetaModules = import.meta.glob('/docs/**/_meta.json') as Record<
    string,
    MetaLoader
  >;
  const groupMetaModules = import.meta.glob('/docs/*/_meta.json', {
    eager: true,
    import: 'default',
  }) as Record<string, ContentMeta>;

  const groupMap: Map<string, string[]> = new Map<string, string[]>();
  Object.keys(mdModules).forEach((path) => {
    const group = path.split('/docs/')[1].split('/')[0];
    const current = groupMap.get(group) ?? [];
    current.push(path);
    groupMap.set(group, current);
  });

  const groups: ContentGroup[] = [...groupMap.entries()].map(([folder, paths]) => {
    const groupMetaPath = `/docs/${folder}/_meta.json`;
    const groupMeta = groupMetaModules[groupMetaPath];
    let cache: ContentSection[];

    return {
      key: folder,
      title: groupMeta?.title ?? folder,
      load: async () => {
        if (cache) {
          return cache;
        }

        const sectionMap: Map<string, ContentSection> = new Map<string, ContentSection>();
        for (const path of paths) {
          const [, section, filename] = path.split('/docs/')[1].split('/');

          const current = sectionMap.get(section) ?? {
            key: section,
            title: section.replace(/^\d+-/, ''),
            files: [],
          };
          const metaPath = path.replace(/\/[^/]+\.md$/, '/_meta.json');
          if (sectionMetaModules[metaPath]) {
            const meta = await sectionMetaModules[metaPath]();
            current.title = meta.title;
          }

          const raw = await mdModules[path]();
          const { attributes, body } = fm<ContentMeta>(raw);
          current.files.push({
            title: attributes.title || filename.replace(/^\d+-/, '').replace(/\.md$/, ''),
            content: body,
          });
          sectionMap.set(section, current);
        }

        cache = [...sectionMap.values()];

        return cache;
      },
    };
  });

  return groups.reverse();
};

export const CONTENT: ContentGroup[] = createContent();

export interface ContentMeta extends Record<string, string> {
  title: string;
}

export type MdLoader = () => Promise<string>;
export type MetaLoader = () => Promise<ContentMeta>;

export interface ContentGroup {
  key: string;
  title: string;
  meta: ContentMeta;
  load: () => Promise<ContentSection[]>;
}

export interface ContentSection {
  key: string;
  title: string;
  meta?: ContentMeta;
  files: {
    title: string;
    content: string;
  }[];
}

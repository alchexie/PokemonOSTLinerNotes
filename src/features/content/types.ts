export interface ContentMeta extends Record<string, string> {
  title: string;
}

export type MdLoader = () => Promise<string>;

export interface ContentGroup {
  key: string;
  title: string;
  meta: ContentMeta;
  load: () => Promise<ContentSection[]>;
}

export interface ContentSection {
  key: string;
  title: string;
  meta: ContentMeta;
  files: {
    key: string;
    title: string;
    meta: ContentMeta;
    content: string;
  }[];
}

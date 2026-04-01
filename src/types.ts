export interface ContentMeta extends Record<string, string> {
  title: string;
}

export interface ContentSeries {
  key: string;
  title: string;
  meta: ContentMeta;
  sections: ContentSection[];
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

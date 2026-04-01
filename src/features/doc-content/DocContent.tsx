import { useEffect, useState, useRef } from 'react';
import type { ContentSeries } from '@/types';
import { loadContentByOstSeries } from '@/services/content-repository';
import DocViewer from './components/DocViewer';
import MetaInfo from './components/MetaInfo';
import Loading from '../loading/loading';

type DocContentProps = {
  ostSeries: string;
};

export default function DocContent({ ostSeries }: DocContentProps) {
  const [currentContent, setCurrentContent] = useState<ContentSeries | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLoading(true);
    loadContentByOstSeries(ostSeries)
      .then((data) => {
        setCurrentContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [ostSeries]);

  if (loading) {
    return <Loading></Loading>;
  }

  if (!currentContent) return null;

  return (
    <>
      <DocViewer current={currentContent} contentRef={contentRef} />
      <MetaInfo current={currentContent} contentRef={contentRef} />
    </>
  );
}

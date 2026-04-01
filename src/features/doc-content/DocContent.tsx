import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ContentGroup } from './types';
import { CONTENT_GROUPS, loadContentByOstSeries } from './data';
import DocViewer from './components/DocViewer';
import MetaInfo from './components/MetaInfo';
import { TITLE } from '../../App';

export default function DocContent() {
  const navigate = useNavigate();
  const { ostSeries } = useParams();
  const [currentContent, setCurrentContent] = useState<ContentGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const groups = CONTENT_GROUPS;
  const currentMeta = useMemo(() => {
    return groups.find((g) => g.key === ostSeries) || groups[0];
  }, [ostSeries]);

  useEffect(() => {
    if (!groups.length) return;
    if (!ostSeries) {
      navigate(`/docs/${groups[0].key}`, { replace: true });
      return;
    }

    const isValid = groups.some((g) => g.key === ostSeries);
    if (!isValid) {
      navigate('/docs', { replace: true });
      return;
    }

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

  useEffect(() => {
    if (!currentMeta) return;
    document.title = `${currentMeta.title} - ${TITLE}`;
  }, [currentMeta]);

  if (loading) {
    return (
      <article id="doc-viewer">
        <p>Loading...</p>
      </article>
    );
  }

  if (!currentContent) return null;

  return (
    <>
      <DocViewer current={currentContent}></DocViewer>
      <MetaInfo current={currentContent}></MetaInfo>
    </>
  );
}

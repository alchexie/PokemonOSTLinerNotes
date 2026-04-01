import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DocContent from '@/features/doc-content/DocContent';
import { CONTENT_SERIES_LIST } from '@/services/content-repository';
import { TITLE } from '@/App';

export default function Docs() {
  const { ostSeries } = useParams();
  const navigate = useNavigate();

  const currentMeta = useMemo(() => {
    return CONTENT_SERIES_LIST.find((g) => g.key === ostSeries) || CONTENT_SERIES_LIST[0];
  }, [ostSeries]);

  useEffect(() => {
    if (!currentMeta) return;
    document.title = `${currentMeta.title} - ${TITLE}`;
  }, [currentMeta]);

  useEffect(() => {
    if (!ostSeries) {
      navigate(`/docs/${CONTENT_SERIES_LIST[0].key}`, { replace: true });
      return;
    }
    const isValid = CONTENT_SERIES_LIST.some((g) => g.key === ostSeries);
    if (!isValid) {
      navigate('/docs', { replace: true });
    }
  }, [ostSeries]);

  return ostSeries && <DocContent ostSeries={ostSeries} />;
}

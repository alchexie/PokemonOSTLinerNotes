import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT } from './data';
import DocViewer from './components/DocViewer';
import MetaInfo from './components/MetaInfo';
import { TITLE } from '../../App';

export default function DocContent() {
  const navigate = useNavigate();
  const { ostSeries } = useParams();

  const groups = CONTENT;
  const current = useMemo(() => {
    return groups.find((g) => g.key === ostSeries) || groups[0];
  }, [ostSeries]);

  useEffect(() => {
    if (!ostSeries && groups.length) {
      navigate(`/docs/${groups[0].key}`, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!current) {
      return;
    }
    document.title = `${current.title} - ${TITLE}`;
  }, [current]);

  return (
    <>
      <DocViewer current={current}></DocViewer>
      <MetaInfo current={current}></MetaInfo>
    </>
  );
}

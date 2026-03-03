import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT } from './data';
import DocViewer from './components/DocViewer';
import MetaInfo from './components/MetaInfo';
import { TITLE } from '../main/data';

export default function DocLayout() {
  const navigate = useNavigate();
  const { groupKey } = useParams();

  const groups = CONTENT;
  const current = useMemo(() => {
    return groups.find((g) => g.key === groupKey) || groups[0];
  }, [groupKey]);

  useEffect(() => {
    if (!groupKey && groups.length) {
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

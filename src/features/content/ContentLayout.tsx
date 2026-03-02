import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT } from './data';
import type { ContentSection } from './types';
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

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<ContentSection[]>([]);

  useEffect(() => {
    if (!groupKey && groups.length) {
      navigate(`/docs/${groups[0].key}`, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (!current) {
      return;
    }
    setLoading(true);
    setSections(current.sections);
    document.title = `${current.title} - ${TITLE}`;
    setLoading(false);
  }, [current]);

  return (
    <>
      <DocViewer loading={loading} sections={sections}></DocViewer>
      <MetaInfo current={current}></MetaInfo>
    </>
  );
}

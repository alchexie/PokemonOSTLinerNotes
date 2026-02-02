import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT } from './data';
import type { ContentSection } from './types';
import SideNav from './components/SideNav';
import DocViewer from './components/DocViewer';

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
    current.load().then((data) => {
      setSections(data);
      setLoading(false);
    });
  }, [current]);

  return (
    <main>
      <SideNav groups={groups} current={current} />
      <DocViewer loading={loading} sections={sections}></DocViewer>
    </main>
  );
}

import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TITLE } from '../data';
import { CONTENT } from '../../content/data';

export default function SideNav() {
  const navigate = useNavigate();
  const { groupKey } = useParams();

  const groups = CONTENT;
  const current = useMemo(() => {
    return groups.find((g) => g.key === groupKey) || groups[0];
  }, [groupKey]);

  return (
    <aside id="side-nav">
      <h1>{TITLE}</h1>
      <button>☰</button>
      <nav>
        {/* <a>首页</a>
        <a>音乐家们</a>
        <hr></hr> */}
        {groups.map((g) => (
          <a
            key={g.key}
            className={g.key === current?.key ? 'active' : ''}
            onClick={() => navigate(`/docs/${g.key}`)}
          >
            {g.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

import { useNavigate } from 'react-router-dom';
import type { ContentGroup } from '../types';
import { TITLE } from '../data';

export default function SideNav({
  groups,
  current,
}: {
  groups: ContentGroup[];
  current: ContentGroup;
}) {
  const navigate = useNavigate();

  return (
    <aside id="side-nav">
      <h1>{TITLE}</h1>
      <button>☰</button>
      <nav>
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

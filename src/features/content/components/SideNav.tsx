import { useNavigate } from 'react-router-dom';
import type { ContentGroup } from '../types';

export default function SideNav({
  groups,
  current,
}: {
  groups: ContentGroup[];
  current: ContentGroup;
}) {
  const navigate = useNavigate();

  return (
    <aside>
      <ul>
        {groups.map((g) => (
          <li
            key={g.key}
            className={g.key === current?.key ? 'active' : ''}
            onClick={() => navigate(`/docs/${g.key}`)}
          >
            {g.title}
          </li>
        ))}
      </ul>
    </aside>
  );
}

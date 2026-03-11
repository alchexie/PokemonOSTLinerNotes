import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONTENT } from '../doc-content/data';
import { TITLE } from '../../App';

export default function SideNav() {
  const navigate = useNavigate();
  const { ostSeries } = useParams();

  const groups = CONTENT;
  const current = useMemo(() => {
    return groups.find((g) => g.key === ostSeries) || groups[0];
  }, [ostSeries]);

  return (
    <aside id="side-nav">
      <h1>{TITLE}</h1>
      <button>☰</button>
      <nav className='nav-main'>
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
      <nav className='nav-bottom'>
        <a>音乐家们</a>
        <a>关于</a>
      </nav>
    </aside>
  );
}

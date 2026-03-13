import { useLocation, useNavigate } from 'react-router-dom';
import { CONTENT } from '../doc-content/data';
import { TITLE } from '../../App';

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const contentGroups = CONTENT;
  const others = [
    ['/musicians', '音乐家们'],
    ['/about', '关于'],
  ];

  return (
    <aside id="side-nav">
      <h1>{TITLE}</h1>
      <button>☰</button>
      <nav className="nav-main">
        {contentGroups.map((x) => (
          <a
            key={x.key}
            className={x.key === location.pathname.split('/').at(-1) ? 'active' : ''}
            onClick={() => navigate(`/docs/${x.key}`)}
          >
            {x.title}
          </a>
        ))}
      </nav>
      <nav className="nav-bottom">
        {others.map(([path, title]) => (
          <a
            className={path === location.pathname ? 'active' : ''}
            onClick={() => navigate(path)}
          >
            {title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

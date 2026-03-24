import { useLocation, useNavigate } from 'react-router-dom';
import { useMobileOverlay } from '@/hooks/useMobileOverlay';
import { CONTENT } from '../doc-content/data';
import { TITLE } from '../../App';

export default function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpenOverlay, openOverlay, closeOverlay, refOverlay, refTrigger } =
    useMobileOverlay();

  const contentGroups = CONTENT;
  const others = [
    ['/composer', '作曲家们'],
    ['/about', '关于'],
  ];
  const to = (path: string) => {
    navigate(path);
    closeOverlay();
  };

  return (
    <aside id="side-nav" ref={refOverlay} style={{ zIndex: isOpenOverlay ? 1001 : 999 }}>
      <h1>{TITLE}</h1>
      <button
        ref={refTrigger as React.RefObject<HTMLButtonElement>}
        onClick={openOverlay}
      >
        ☰
      </button>
      <div>
        <nav className="nav-main">
          {contentGroups.map((x) => (
            <a
              key={x.key}
              className={x.key === location.pathname.split('/').at(-1) ? 'active' : ''}
              onClick={() => to(`/docs/${x.key}`)}
            >
              {x.title}
            </a>
          ))}
        </nav>
        <nav className="nav-bottom">
          {others.map(([path, title]) => (
            <a
              key={path}
              className={path === location.pathname ? 'active' : ''}
              onClick={() => to(path)}
            >
              {title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

import { useEffect, useRef, useState } from 'react';
import type { ContentGroup } from '../types';

const baseUrl = import.meta.env.BASE_URL;

export default function MetaInfo({ current }: { current: ContentGroup }) {
  const meta = current.meta;
  const [miniActive, setMiniActive] = useState<boolean>(false);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!asideRef.current) {
        return;
      }
      if (!asideRef.current.contains(e.target as Node)) {
        setMiniActive(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [miniActive]);

  const active = () => {
    if (miniActive) {
      return;
    }
    setMiniActive(true);
  };

  const closeIfMobile = () => {
    if (window.innerWidth < 768) {
      setMiniActive(false);
    }
  };

  return (
    <aside
      ref={asideRef}
      id="meta-info"
      className={miniActive ? 'active' : ''}
      onClick={active}
    >
      <img src={`${baseUrl}assets/images/content/${current.key}.jpg`} />
      <span>{meta.album_cn}</span>
      <table className="meta-table">
        <tbody>
          <tr>
            <td>发行日期：</td>
            <td>{meta.release_date}</td>
          </tr>
          <tr>
            <td>光盘数量：</td>
            <td>{meta.disc_num}</td>
          </tr>
          <tr>
            <td>曲目数量</td>
            <td>{meta.track_num}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <a href={meta.wiki_url} target="_blank">
          专辑详情
        </a>
        <a href={meta.cover_art_url} target="_blank">
          专辑图像
        </a>
      </div>
      <div className="meta-catalog">
        {current.sections.map((x) => {
          return (
            <ul key={x.key}>
              <li>
                <a href={`#${x.key}`} onClick={closeIfMobile}>
                  {x.title}
                </a>
              </li>
              {x.files.map((y) => {
                return (
                  !(x.files.length === 1 && !x.files[0].title) && (
                    <ul key={y.key}>
                      <li>
                        <a href={`#${y.key}`} onClick={closeIfMobile}>
                          {y.title}
                        </a>
                      </li>
                    </ul>
                  )
                );
              })}
            </ul>
          );
        })}
      </div>
      <button className="btn-exit" onClick={closeIfMobile}>
        <img src={`${baseUrl}assets/images/ui/icons/exit.svg`}></img>
      </button>
    </aside>
  );
}

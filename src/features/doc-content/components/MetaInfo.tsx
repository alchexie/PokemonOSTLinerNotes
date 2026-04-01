import React from 'react';
import type { ContentGroup } from '../types';
import { useMobileOverlay } from '@/hooks/useMobileOverlay';

const baseUrl = import.meta.env.BASE_URL;

export default function MetaInfo({ current }: { current: ContentGroup }) {
  const meta = current.meta;
  const { isOpenOverlay, openOverlay, closeOverlay, refOverlay } = useMobileOverlay();

  return (
    <aside
      ref={refOverlay}
      id="meta-info"
      className={isOpenOverlay ? 'active' : ''}
      onClick={openOverlay}
    >
      <div>
        <section className="meta-common">
          <img
            src={`${baseUrl}assets/images/content/${current.key}.jpg`}
            loading="lazy"
          />
          <span>{meta.album_cn}</span>
          <table>
            <tbody>
              <tr>
                <td>发行日期：</td>
                <td>{meta.release_date}</td>
              </tr>
              {meta.game_date && (
                <tr>
                  <td>对应游戏发售日期：</td>
                  <td>{meta.game_date}</td>
                </tr>
              )}
              <tr>
                <td>光盘数量：</td>
                <td>{meta.disc_num}</td>
              </tr>
              <tr>
                <td>曲目数量：</td>
                <td>{meta.track_num}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <a href={meta.wiki_url} target="_blank" rel="noopener noreferrer">
              专辑详情
            </a>
            <a href={meta.cover_art_url} target="_blank" rel="noopener noreferrer">
              专辑图像
            </a>
          </div>
        </section>
        <section className="meta-catalog">
          <nav>
            {current.sections.map((x) => {
              return (
                x.key && (
                  <React.Fragment key={x.key}>
                    {x.files.length === 1 && !x.files[0].title ? (
                      <a href={`#${x.key}`} onClick={closeOverlay} title={x.title}>
                        {x.title}
                      </a>
                    ) : (
                      <>
                        <details open={current.sections.length === 1}>
                          <summary>
                            <span title={x.title}>{x.title}</span>
                          </summary>
                        </details>
                        <nav>
                          {x.files.map((y) => {
                            return (
                              y.title && (
                                <a
                                  key={y.key}
                                  href={`#${y.key}`}
                                  onClick={closeOverlay}
                                  title={y.title}
                                >
                                  {y.title}
                                </a>
                              )
                            );
                          })}
                        </nav>
                      </>
                    )}
                  </React.Fragment>
                )
              );
            })}
          </nav>
        </section>
      </div>
      <button className="btn-exit" onClick={closeOverlay}>
        <img src={`${baseUrl}assets/images/ui/icons/exit.svg`} loading="lazy"></img>
      </button>
    </aside>
  );
}

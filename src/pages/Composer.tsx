import { useEffect } from 'react';
import SeriesTag from '@/features/series-tag/SeriesTag';
import { TITLE } from '@/App';
import composerInfo from '@/data/composer_info.json';

interface ComposerInfo {
  message: string;
  data: {
    name: string;
    ost: string[];
    mark?: 1 | 0;
    url?: string;
  }[];
}

export default function Composer() {
  const title = '作曲家们';

  useEffect(() => {
    document.title = `${title} - ${TITLE}`;
  }, []);

  return (
    <article id="doc-viewer">
      <h2>{title}</h2>
      <p>{(composerInfo as ComposerInfo).message}</p>
      <table>
        <thead>
          <tr>
            <th>名字</th>
            <th>参与作品</th>
          </tr>
        </thead>
        <tbody>
          {(composerInfo as ComposerInfo).data.map((x) => (
            <tr key={x.name}>
              <td>
                <a href={x.url} target="_blank" rel="noreferrer">
                  <span
                    style={{
                      fontWeight: x.mark === 1 ? 'bold' : undefined,
                      opacity: x.mark === 0 ? 0.3 : 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {x.name}
                  </span>
                </a>
              </td>
              <td>
                {x.ost.map((y) => (
                  <SeriesTag key={y} type={y} display="inline-block" />
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

import { useEffect } from 'react';
import SeriesTag from '../features/series-tag/SeriesTag';
import { TITLE } from '../App';

interface Composer {
  name: string;
  ost: string[];
  mark?: 1 | 0;
  url?: string;
}

const composerInfo: { message: string; data: Composer[] } = await fetch(
  `${import.meta.env.BASE_URL}data/composer_info.json`
).then((res) => res.json());

export default function Composer() {
  const title = '作曲家们';

  useEffect(() => {
    document.title = `${title} - ${TITLE}`;
  }, []);

  return (
    <article id="doc-viewer">
      <h2>{title}</h2>
      <p>{composerInfo.message}</p>
      <table>
        <thead>
          <tr>
            <th>名字</th>
            <th>参与作品</th>
          </tr>
        </thead>
        <tbody>
          {composerInfo.data.map((x, idx) => (
            <tr key={idx}>
              <td>
                <a href={x.url} target="_blank">
                  <span
                    style={{
                      fontWeight: x.mark === 1 ? 'bold' : '',
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
                  <SeriesTag key={y} type={y} display="inline-block"></SeriesTag>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

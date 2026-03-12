import { useEffect } from 'react';
import SeriesTag from '../features/series-tag/SeriesTag';
import { TITLE } from '../App';

interface Musician {
  name: string;
  ost: string[];
  mark?: 1 | 0;
  url?: string;
}

const musicianInfo: { message: string; data: Musician[] } = await fetch(
  `${import.meta.env.BASE_URL}data/musician_info.json`
).then((r) => r.json());

export default function Musicians() {
  const title = '音乐家们';

  useEffect(() => {
    document.title = `${title} - ${TITLE}`;
  }, []);

  return (
    <article id="doc-viewer">
      <h2>{title}</h2>
      <p>{musicianInfo.message}</p>
      <table className="musicians-table">
        <thead>
          <tr>
            <th>音乐家</th>
            <th>参与作品</th>
          </tr>
        </thead>
        <tbody>
          {musicianInfo.data.map((x, idx) => (
            <tr key={idx}>
              <td>
                <span
                  style={{
                    fontWeight: x.mark === 1 ? 'bold' : '',
                    opacity: x.mark === 0 ? 0.3 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {x.name}
                </span>
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

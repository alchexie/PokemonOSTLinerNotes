import type { ContentGroup } from '../types';

export default function MetaInfo({ current }: { current: ContentGroup }) {
  const meta = current.meta;

  return (
    <aside id="meta-info">
      <img src={`../images/${current.key}.jpg`} />
      <span>{meta.album_cn}</span>
      <table>
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
    </aside>
  );
}

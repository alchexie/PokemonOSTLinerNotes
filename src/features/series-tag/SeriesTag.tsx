import { SERIES_TAG_COLOR_MAP } from './data';

export default function SeriesTag({
  type,
  display = 'inline',
}: {
  type: string;
  display?: 'inline' | 'inline-block';
}) {
  const key = type.toUpperCase();
  const config = SERIES_TAG_COLOR_MAP[key];

  if (!config) {
    return <span>type</span>;
  } else {
    return (
      <span
        className="series-tag"
        style={{ display: display, marginRight: display === 'inline-block' ? '1em' : '' }}
      >
        {config.map(([text, color], idx) => (
          <span
            key={idx}
            style={{
              color: color ?? 'inherit',
            }}
          >
            {text}
          </span>
        ))}
      </span>
    );
  }
}

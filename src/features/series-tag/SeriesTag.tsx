import { SERIES_TAG_COLOR_MAP } from './data';

export default function SeriesTag({ type }: { type: string }) {
  const key = type.toUpperCase();
  const config = SERIES_TAG_COLOR_MAP[key];

  if (!config) {
    return <span>type</span>;
  } else {
    return (
      <span className="series-tag">
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

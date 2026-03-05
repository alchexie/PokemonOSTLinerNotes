import { type JSX } from 'react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import AudioProgressBar from './components/AudioProgressBar';

export function AudioPlayer() {
  const ap = useAudioPlayer();

  if (!ap.queue.length) {
    return null;
  }

  return (
    <div id="audio-player">
      <div className="audio-player-buttons">
        <IconButton iconName={'prev'}></IconButton>
        {ap.paused ? (
          <IconButton iconName={'play'}></IconButton>
        ) : (
          <IconButton iconName={'pause'}></IconButton>
        )}
        <IconButton iconName={'next'}></IconButton>
      </div>
      <AudioProgressBar></AudioProgressBar>
    </div>
  );
}

function IconButton({ iconName }: { iconName: string }) {
  const ap = useAudioPlayer();
  const icons: Record<string, JSX.Element> = {
    play: <path d="M8 5v14l11-7z" />,
    pause: <path d="M6 19h4V5H6zm8-14v14h4V5z" />,
    prev: (
      <>
        <rect x="4" y="5" width="2" height="14" />
        <polygon points="17,5 9,12 17,19" />
      </>
    ),
    next: (
      <>
        <polygon points="7,5 15,12 7,19" />
        <rect x="18" y="5" width="2" height="14" />
      </>
    ),
    stop: <rect x="6" y="6" width="12" height="12" />,
  };

  return (
    <button onClick={(ap as any)[iconName]}>
      <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor">
        {icons[iconName]}
      </svg>
    </button>
  );
}

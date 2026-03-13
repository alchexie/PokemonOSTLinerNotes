import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const baseUrl = import.meta.env.BASE_URL;
const getIconUrl = (iconName: string): string =>
  `${baseUrl}assets/images/ui/icons/player/${iconName}.svg`;

export default function AudioTools() {
  const { queue, currentQueueIndex, mute, mode, jumpTo, toggleMute, switchMode, close } =
    useAudioPlayer();
  const [visiblePlaylist, setVisiblePlaylist] = useState<boolean>(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!toolsRef.current || !visiblePlaylist) {
        return;
      }
      if (!toolsRef.current.contains(e.target as Node)) {
        setVisiblePlaylist(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [visiblePlaylist]);

  useEffect(() => {
    setTimeout(() => {
      if (queue.length > 1) {
        setVisiblePlaylist(true);
      }
    });
  }, [JSON.stringify(queue)]);

  const currentSeries = queue[currentQueueIndex].series;

  return (
    <div ref={toolsRef} className="audio-player-tools">
      <button onClick={switchMode}>
        <img src={getIconUrl(`repeat${mode}`)}></img>
      </button>
      <span>|</span>
      <button
        className={visiblePlaylist ? ' active' : ''}
        onClick={() => {
          setVisiblePlaylist(!visiblePlaylist);
        }}
      >
        <img src={getIconUrl('playlist')}></img>
      </button>
      <button
        className={`audio-player-tools-volume${mute ? ' mute' : ''} no-hover`}
        onClick={toggleMute}
      >
        <img src={getIconUrl('volume')}></img>
      </button>
      <button onClick={close}>
        <img src={getIconUrl('close')}></img>
      </button>
      <div
        className={`audio-player-playlist${visiblePlaylist ? ' active' : ''}`}
        style={{
          backgroundImage: `url("${baseUrl}assets/images/content/${currentSeries}.jpg")`,
        }}
      >
        <div className="audio-player-playlist-content">
          <div>
            {queue.map((x, idx) => {
              return (
                <span
                  key={idx}
                  className={currentQueueIndex === idx ? 'active' : ''}
                  onDoubleClick={() => {
                    jumpTo(idx);
                  }}
                >
                  <span>
                    {x.titleJP}【{x.titleCN}】
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

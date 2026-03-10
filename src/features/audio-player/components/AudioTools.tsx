import { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import playlistIcon from '@/assets/icons/player/playlist.svg';
import volumeIcon from '@/assets/icons/player/volume.svg';
import closeIcon from '@/assets/icons/player/close.svg';
import repeat0Icon from '@/assets/icons/player/repeat0.svg';
import repeat1Icon from '@/assets/icons/player/repeat1.svg';
import repeat2Icon from '@/assets/icons/player/repeat2.svg';

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
        <img src={!mode ? repeat0Icon : mode === 1 ? repeat1Icon : repeat2Icon}></img>
      </button>
      <span>|</span>
      <button
        className={visiblePlaylist ? ' active' : ''}
        onClick={() => {
          setVisiblePlaylist(!visiblePlaylist);
        }}
      >
        <img src={playlistIcon}></img>
      </button>
      <button
        className={`audio-player-tools-volume${mute ? ' mute' : ''} no-hover`}
        onClick={toggleMute}
      >
        <img src={volumeIcon}></img>
      </button>
      <button onClick={close}>
        <img src={closeIcon}></img>
      </button>
      <div
        className={`audio-player-playlist${visiblePlaylist ? ' active' : ''}`}
        style={{
          backgroundImage: `url("${import.meta.env.BASE_URL}/images/${currentSeries}.jpg")`,
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

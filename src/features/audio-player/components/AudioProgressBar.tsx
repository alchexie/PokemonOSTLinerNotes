import { useRef, useState } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatTime } from '../utils/formatTime';

export default function AudioProgressBar() {
  const { queue, currentQueueIndex, currentTime, duration, seekTo } = useAudioPlayer();
  const currentTrack = queue[currentQueueIndex];

  const barRef = useRef<HTMLDivElement>(null);
  const [dragPercent, setDragPercent] = useState<number | null>(null);
  const [lockTime, setLockTime] = useState<number | null>(null);

  if (lockTime !== null && Math.abs(currentTime - lockTime) < 0.5) {
    setLockTime(null);
  }

  const calcPercent = (clientX: number) => {
    const rect = barRef.current!.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    if (percent < 0) {
      percent = 0;
    }
    if (percent > 100) {
      percent = 100;
    }
    return percent;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const percent = calcPercent(e.clientX);
    setDragPercent(percent);

    const handleMove = (e: MouseEvent) => {
      setDragPercent(calcPercent(e.clientX));
    };

    const handleUp = (e: MouseEvent) => {
      const percent = calcPercent(e.clientX);
      const time = duration * (percent / 100);

      seekTo(time);
      setDragPercent(null);
      setLockTime(time);

      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  };

  const displayTime =
    lockTime ?? (dragPercent !== null ? (dragPercent / 100) * duration : currentTime);
  const percent = duration ? (displayTime / duration) * 100 : 0;

  return (
    <div className="audio-player-progress">
      <span className="audio-player-progress-title">
        {currentTrack.titleJP} 【{currentTrack.titleCN}】
      </span>
      <div>
        <div
          ref={barRef}
          className="audio-player-progress-bar"
          onMouseDown={handleMouseDown}
        >
          <div>
            <div
              className="audio-player-progress-bar-fill"
              style={{ width: `${percent}%` }}
            />

            <div
              className="audio-player-progress-bar-trigger"
              style={{ left: `${percent}%` }}
            />
          </div>
        </div>
        <span>
          {formatTime(displayTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  flip,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import { useState } from 'react';
import { useAudioPlayer } from '../../audio-player/hooks/useAudioPlayer';
import type { Audio } from '../../audio-player/types';
import musicIcon from '@/assets/icons/music.svg';
import SeriesTag from '../../series-tag/SeriesTag';
import { getOstSeries } from '../../series-tag/utils/getOstSeries';

interface TrackPopupTriggerProps {
  label: ReactNode;
  trackIndexes: string[];
}

interface TrackPopupProps {
  trackIndexes: string[];
  isClosing?: boolean;
}

const trackInfo: Record<string, string[][]> = await fetch(
  `${import.meta.env.BASE_URL}data/track_info.json`
).then((r) => r.json());

const getPortalContainer = () => {
  const id = 'track-popup-portal';
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: '9999',
      pointerEvents: 'none',
    });
    document.body.appendChild(container);
  }
  return container;
};

export default function TrackPopupTrigger({
  label,
  trackIndexes,
}: TrackPopupTriggerProps) {
  const { queue, currentQueueIndex } = useAudioPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ padding: 10 }),
      shift({ padding: 50, mainAxis: true, crossAxis: true }),
    ],
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) {
        setIsClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
        }, 150);
      } else {
        setIsOpen(true);
        setIsClosing(false);
      }
    },
  });
  const hover = useHover(context, {
    delay: { open: 0, close: 150 },
    handleClose: safePolygon(),
  });
  const dismiss = useDismiss(context, {
    ancestorScroll: true,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss]);

  const currentAudio = queue[currentQueueIndex];

  return (
    <strong
      ref={refs.setReference}
      {...getReferenceProps()}
      className="track-popup-trigger"
      style={{ display: 'inline-block' }}
    >
      {trackIndexes.includes(`${currentAudio?.series}-${currentAudio?.indexiTunes}`) && (
        <img src={musicIcon} className="music-icon active hidden-md"></img>
      )}
      {label}
      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, pointerEvents: 'auto' }}
            {...getFloatingProps()}
          >
            <TrackPopupContent trackIndexes={trackIndexes} isClosing={isClosing} />
          </div>,
          getPortalContainer()
        )}
    </strong>
  );
}

function TrackPopupContent({ trackIndexes, isClosing }: TrackPopupProps) {
  const { queue, currentQueueIndex, awake } = useAudioPlayer();
  const tracks: Audio[] = trackIndexes.map((x) => {
    const [series, index] = x.split('-');
    const track = trackInfo[series].find((y) => y.slice(0, 2).includes(index))!;
    return {
      series,
      ostSeries: getOstSeries(series),
      indexDisc: track[0],
      indexiTunes: track[1],
      titleJP: track[2],
      titleCN: track[3],
    };
  });
  const currentAudio = queue[currentQueueIndex];

  return (
    <div className={`track-popup${isClosing ? ' track-popup-closing' : ''}`}>
      {tracks.map((x, idx) => {
        return (
          <div key={idx}>
            <span className="track-index">
              <span>
                <SeriesTag type={x.series}></SeriesTag>
              </span>
              <button className="hidden-md" onClick={() => awake(tracks, idx)}>
                <img
                  src={musicIcon}
                  className={`music-icon${currentAudio && currentAudio.ostSeries === x.ostSeries && currentAudio.indexiTunes === x.indexiTunes ? ' active' : ''}`}
                ></img>
              </button>
            </span>
            <span>
              <span>{`${x.titleJP}`}</span>
              <span className="track-title-cn">
                <br></br>
                <small>{x.titleCN}</small>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

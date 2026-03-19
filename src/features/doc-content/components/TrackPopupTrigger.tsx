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
import SeriesTag from '../../series-tag/SeriesTag';
import { getOstSeries } from '../utils/getOstSeries';

const baseUrl = import.meta.env.BASE_URL;
const musicIconUrl = `${baseUrl}assets/images/ui/icons/music.svg`;

interface TrackPopupTriggerProps {
  label: ReactNode;
  trackIndexes: string[];
}

interface TrackPopupProps {
  trackIndexes: string[];
  isClosing?: boolean;
}

const trackInfo: Record<string, string[][]> = await fetch(
  `${baseUrl}data/track_info.json`
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
  const foramtTrackIndexes = trackIndexes.map((x) => {
    const [ost, index] = x.split('-');
    if (/^[0-9]+$/.test(index)) {
      return x;
    }
    return `${ost}-${trackInfo[getOstSeries(ost)].find((y) => index === y[0])![1]}`;
  });

  return (
    <strong
      ref={refs.setReference}
      {...getReferenceProps()}
      className="track-popup-trigger"
      style={{ display: 'inline-block' }}
    >
      {foramtTrackIndexes.includes(
        `${currentAudio?.series}-${currentAudio?.indexiTunes}`
      ) && <img src={musicIconUrl} className="music-icon active hidden-md"></img>}
      {label}
      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, pointerEvents: 'auto' }}
            {...getFloatingProps()}
          >
            <TrackPopupContent trackIndexes={foramtTrackIndexes} isClosing={isClosing} />
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
    const ostSeries = getOstSeries(series);
    const track = trackInfo[ostSeries].find((y) => y.slice(0, 2).includes(index))!;
    return {
      series,
      ostSeries: ostSeries,
      indexDisc: track[0],
      indexiTunes: track[1],
      titleJP: track[2],
      titleCN: track[3],
    };
  });
  const currentAudio = queue[currentQueueIndex];

  return (
    <div className={`track-popup${isClosing ? ' track-popup-closing' : ''}`}>
      <table>
        <tbody>
          {tracks.map((x, idx) => (
            <tr key={idx}>
              <td>
                <SeriesTag type={x.series}></SeriesTag>
              </td>
              <td>
                <button onClick={() => awake(tracks, idx)}>
                  <img
                    src={musicIconUrl}
                    className={`music-icon${currentAudio && currentAudio.ostSeries === x.ostSeries && currentAudio.indexiTunes === x.indexiTunes ? ' active' : ''}`}
                  ></img>
                </button>
              </td>
              <td>
                <span>{`${x.titleJP}`}</span>
                <span>
                  <small>{x.titleCN}</small>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

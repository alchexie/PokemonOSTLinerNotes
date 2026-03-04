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

interface TrackPopupTriggerProps {
  label: ReactNode;
  groupKey: string;
  trackIndexes: string[];
}

interface TrackPopupProps {
  groupKey: string;
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
  groupKey,
  trackIndexes,
}: TrackPopupTriggerProps) {
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

  return (
    <strong
      ref={refs.setReference}
      {...getReferenceProps()}
      className="track-popup-trigger"
      style={{ display: 'inline-block' }}
    >
      {label}
      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, pointerEvents: 'auto' }}
            {...getFloatingProps()}
          >
            <TrackPopupContent
              groupKey={groupKey}
              trackIndexes={trackIndexes}
              isClosing={isClosing}
            />
          </div>,
          getPortalContainer()
        )}
    </strong>
  );
}

function TrackPopupContent({ groupKey, trackIndexes, isClosing }: TrackPopupProps) {
  return (
    <div className={`track-popup${isClosing ? ' track-popup-closing' : ''}`}>
      {trackIndexes.map((index, idx) => {
        const [key, trackIndex] = index.split('-');
        const track = trackInfo[key].find((x) =>
          x.slice(0, 2).includes(trackIndex.replace('+', ''))
        )!;

        return (
          <div key={idx}>
            <span>
              {`${key === groupKey ? '' : `[${key}]-`}${track[0]} (${track[1]})`}
              &nbsp;-&nbsp;
            </span>
            <span>
              <span>{`${track[2]}`}</span>
              {trackIndex.includes('+') && (
                <span className="track-title-cn">
                  <br></br>
                  {track[3]}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

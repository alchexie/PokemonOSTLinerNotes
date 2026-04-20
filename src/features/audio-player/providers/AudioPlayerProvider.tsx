import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
} from 'react';
import type { AudioPlayerContextProps, AudioPlayerHandlers } from '../types';
import { AudioPlayerCore } from '../services/AudioPlayerCore';

export const AudioPlayerContext = createContext<AudioPlayerContextProps | null>(null);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const core = AudioPlayerCore.getInstance();
  const [state, setState] = useState(core.getState());

  const sync = useCallback(() => setState({ ...core.getState() }), [core]);
  const rafIdRef = useRef<number | null>(null);
  const startRaf = useCallback(() => {
    if (rafIdRef.current == null) {
      const loop = () => {
        sync();
        rafIdRef.current = window.requestAnimationFrame(loop);
      };
      rafIdRef.current = window.requestAnimationFrame(loop);
    }
  }, [sync]);
  const stopRaf = useCallback(() => {
    if (rafIdRef.current != null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
      sync();
    }
  }, [sync]);

  useEffect(() => {
    core.audio.addEventListener('loadedmetadata', sync);
    core.audio.addEventListener('play', startRaf);
    core.audio.addEventListener('pause', stopRaf);
    core.audio.addEventListener('ended', stopRaf);

    if (!core.audio.paused) startRaf();

    return () => {
      core.audio.removeEventListener('loadedmetadata', sync);
      core.audio.removeEventListener('play', startRaf);
      core.audio.removeEventListener('pause', stopRaf);
      core.audio.removeEventListener('ended', stopRaf);
      stopRaf();
    };
  }, [core, startRaf, stopRaf, sync]);

  const methodNames = [
    'awake',
    'play',
    'pause',
    'stop',
    'jumpTo',
    'prev',
    'next',
    'seekTo',
    'close',
    'toggleMute',
    'switchMode',
  ];
  const handlers: AudioPlayerHandlers = useMemo(
    () =>
      Object.fromEntries(
        methodNames.map((x) => [
          x,
          (...args: any[]) =>
            Promise.resolve((core as any)[x](...args)).then(() => {
              setState({ ...core.getState() });
              if (!core.audio.paused) startRaf();
            }),
        ])
      ) as unknown as AudioPlayerHandlers,
    [core, startRaf]
  );

  return (
    <AudioPlayerContext.Provider value={{ ...state, ...handlers }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

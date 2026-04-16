import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Audio, AudioPlayerContextProps, AudioPlayerHandlers } from '../types';
import { AudioPlayerCore } from '../services/AudioPlayerCore';

export const AudioPlayerContext = createContext<AudioPlayerContextProps | null>(null);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const core = AudioPlayerCore.getInstance();
  const [state, setState] = useState(core.getState());

  useEffect(() => {
    const sync = () => setState({ ...core.getState() });
    let rafId: number | null = null;
    const startRaf = () => {
      if (rafId == null) {
        const loop = () => {
          sync();
          rafId = window.requestAnimationFrame(loop);
        };
        rafId = window.requestAnimationFrame(loop);
      }
    };
    const stopRaf = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

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
  }, []);

  const methodNames = [
    'play',
    'pause',
    'stop',
    'jumpTo',
    'prev',
    'next',
    'seekTo',
    'close',
  ] as const;
  const methodWrapper = <K extends (typeof methodNames)[number]>(
    name: K
  ): AudioPlayerCore[K] =>
    ((...args: any[]) =>
      Promise.resolve((core as any)[name](...args)).then(() => {
        setState({ ...core.getState() });
      })) as AudioPlayerCore[K];

  const handlers: AudioPlayerHandlers = {
    awake: async (tracks: Audio[], startQueueIndex?: number) => {
      await core.awake(tracks, startQueueIndex);
      setState({ ...core.getState() });
    },
    ...(Object.fromEntries(methodNames.map((x) => [x, methodWrapper(x)])) as Pick<
      AudioPlayerCore,
      (typeof methodNames)[number]
    >),
    toggleMute: () => {
      core.toggleMute();
      setState({ ...core.getState() });
    },
    switchMode: () => {
      core.switchMode();
      setState({ ...core.getState() });
    },
  };

  return (
    <AudioPlayerContext.Provider value={{ ...state, ...handlers }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

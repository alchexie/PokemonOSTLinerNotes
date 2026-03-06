import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Audio, AudioPlayerContextProps, AudioPlayerHandlers } from '../types';
import { AudioPlayerCore } from '../services/AudioPlayerCore';

export const AudioPlayerContext = createContext<AudioPlayerContextProps | null>(null);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const core = AudioPlayerCore.getInstance();
  const [state, setState] = useState(core.getState());

  useEffect(() => {
    const sync = () => setState({ ...core.getState() });
    const handlerNames = ['loadedmetadata', 'play', 'pause', 'timeupdate'];
    handlerNames.forEach((x) => {
      core.audio.addEventListener(x, sync);
    });

    return () => {
      handlerNames.forEach((x) => {
        core.audio.removeEventListener(x, sync);
      });
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
    'toggleMute',
    'switchMode',
    'close',
  ] as const;
  const handlers: AudioPlayerHandlers = {
    awake: (tracks: Audio[], startQueueIndex?: number) => {
      core.awake(tracks, startQueueIndex);
      setState({ ...core.getState() });
    },
    ...(Object.fromEntries(
      methodNames.map((x) => [x, (core as any)[x].bind(core)])
    ) as Pick<AudioPlayerCore, (typeof methodNames)[number]>),
  };

  return (
    <AudioPlayerContext.Provider value={{ ...state, ...handlers }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export interface Audio {
  series: string;
  ostSeries: string;
  indexDisc: string;
  indexiTunes: string;
  titleCN: string;
  titleJP: string;
  titleEN: string;
}

export interface AudioPlayerState {
  queue: Audio[];
  currentQueueIndex: number;
  duration: number;
  currentTime: number;
  paused: boolean;
  mute: boolean;
  mode: number;
}

export interface AudioPlayerHandlers {
  awake: (tracks: Audio[], startQueueIndex?: number) => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  jumpTo: (queueIndex: number) => Promise<void>;
  prev: () => Promise<void>;
  next: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  switchMode: () => void;
  close: () => void;
}

export type AudioPlayerContextProps = AudioPlayerState & AudioPlayerHandlers;

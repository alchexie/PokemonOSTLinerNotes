export interface Audio {
  series: string;
  indexDisc: string;
  indexiTunes: string;
  titleJP: string;
  titleCN: string;
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
  awake: (tracks: Audio[], startQueueIndex?: number) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  jumpTo: (queueIndex: number) => void;
  prev: () => void;
  next: () => void;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  switchMode: () => void;
  close: () => void;
}

export type AudioPlayerContextProps = AudioPlayerState & AudioPlayerHandlers;

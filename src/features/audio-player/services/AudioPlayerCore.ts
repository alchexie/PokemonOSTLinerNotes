import type { Audio, AudioPlayerState } from '../types';

export class AudioPlayerCore {
  private static instance: AudioPlayerCore | null = null;

  static getInstance(): AudioPlayerCore {
    if (!AudioPlayerCore.instance) {
      AudioPlayerCore.instance = new AudioPlayerCore();
    }
    return AudioPlayerCore.instance;
  }

  readonly audio: HTMLAudioElement;
  queue: Audio[];
  currentQueueIndex: number;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.addEventListener('ended', () => this.next());
    this.queue = [];
    this.currentQueueIndex = -1;
  }

  awake(tracks: Audio[], startQueueIndex: number = 0): void {
    this.queue = tracks;
    this.currentQueueIndex = startQueueIndex;
    this.load(tracks[startQueueIndex]);
    this.audio.play();
  }

  load(track: Audio): void {
    const { series, indexiTunes } = track;
    this.audio.src = `${import.meta.env.BASE_URL}assets/audio/${series}/${indexiTunes}.mp3`;
    this.audio.load();
  }

  play(): void {
    this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  prev(): void {
    this.currentQueueIndex =
      (this.currentQueueIndex - 1 + this.queue.length) % this.queue.length;
    this.load(this.queue[this.currentQueueIndex]);
    this.audio.play();
  }

  next(): void {
    this.currentQueueIndex = (this.currentQueueIndex + 1) % this.queue.length;
    this.load(this.queue[this.currentQueueIndex]);
    this.audio.play();
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  getState(): AudioPlayerState {
    return {
      queue: [...this.queue],
      currentQueueIndex: this.currentQueueIndex,
      duration: this.audio.duration || 0,
      currentTime: this.audio.currentTime,
      paused: this.audio.paused,
    };
  }

  close() {
    this.stop();
    this.audio.src = '';
    this.queue = [];
    this.currentQueueIndex = -1;
  }
}

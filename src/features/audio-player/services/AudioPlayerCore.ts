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
  mode: number = 2;
  private _handleEnded!: () => void;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.switchMode();
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

  jumpTo(queueIndex: number): void {
    if (queueIndex === this.currentQueueIndex) {
      return;
    }
    this.currentQueueIndex = queueIndex;
    this.load(this.queue[this.currentQueueIndex]);
    this.audio.play();
  }

  prev(): void {
    this.jumpTo((this.currentQueueIndex - 1 + this.queue.length) % this.queue.length);
  }

  next(): void {
    this.jumpTo((this.currentQueueIndex + 1) % this.queue.length);
  }

  seekTo(time: number): void {
    this.audio.currentTime = time;
  }

  toggleMute() {
    this.audio.volume = +!this.audio.volume;
  }

  switchMode() {
    this.mode = (this.mode + 1) % 3;
    if (this._handleEnded) {
      this.audio.removeEventListener('ended', this._handleEnded);
    }
    switch (this.mode) {
      case 0:
        this._handleEnded = () => {
          const prevIndex = this.currentQueueIndex;
          if (prevIndex === this.queue.length - 1) {
            this.load(this.queue[(this.currentQueueIndex = 0)]);
          } else {
            this.next();
          }
        };
        break;
      case 1:
        this._handleEnded = () => this.next();
        break;
      case 2:
        this._handleEnded = () => {
          this.seekTo(0);
          this.play();
        };
        break;
    }
    this.audio.addEventListener('ended', this._handleEnded);
  }

  getState(): AudioPlayerState {
    return {
      queue: [...this.queue],
      currentQueueIndex: this.currentQueueIndex,
      duration: this.audio.duration || 0,
      currentTime: this.audio.currentTime,
      paused: this.audio.paused,
      mute: !this.audio.volume,
      mode: this.mode,
    };
  }

  close() {
    this.stop();
    this.audio.src = '';
    this.queue = [];
    this.currentQueueIndex = -1;
  }
}

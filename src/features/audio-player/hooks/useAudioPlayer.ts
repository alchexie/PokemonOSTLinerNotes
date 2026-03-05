import { useContext } from 'react';
import type { AudioPlayerContextProps } from '../types';
import { AudioPlayerContext } from '../providers/AudioPlayerProvider';

export function useAudioPlayer(): AudioPlayerContextProps {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within <AudioPlayerProvider>');
  }
  return context;
}

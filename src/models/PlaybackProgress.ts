import type { Track } from './Track';

export type PlaybackProgress = {
  track: Track | undefined;
  playing: boolean;
  currentTime: number;
  duration: number;
};

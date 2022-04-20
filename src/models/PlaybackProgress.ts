import type { Track } from './Track';

export type PlaybackProgress = {
  track: Track | undefined;
  allTracks: Track[];
  playing: boolean;
  currentTime: number;
  duration: number;
};

import type { BaseSettings } from 'onyx-ui/models';
import type { PlaylistData } from './PlaylistData';
import type { TrackData } from './TrackData';

export type Settings = BaseSettings & {
  trackPrimaryText: TrackData;
  trackSecondaryText: TrackData;
  trackAccentText: TrackData;
  trackStats: boolean;
  playlistPrimaryText: PlaylistData;
  playlistSecondaryText: PlaylistData;
  playlistAccentText: PlaylistData;
  playlistStats: boolean;
};

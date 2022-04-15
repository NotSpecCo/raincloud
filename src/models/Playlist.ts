import type { Track } from './Track';
import type { User } from './User';

export type Playlist = {
  kind: 'playlist';
  id: number;
  duration: number;
  genre: string;
  release_year?: number;
  release_month?: number;
  release_day?: number;
  description: string;
  tag_list: string;
  user: User;
  label_name?: string;
  streamable: boolean;
  artwork_url: string;
  permalink_url: string;
  tracks?: Track[];
  track_count: number;
  last_modified: string; // Date
  created_at: string; // Date
  playlist_type?: string;
  type?: string;
  likes_count: number;
  tags?: string;
  title: string;
};

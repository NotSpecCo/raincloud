import type { User } from './User';

export type StreamItem = {
  type: 'playlist' | 'track' | 'playlist:repost' | 'track:repost';
  created_at: string;
  origin: {
    kind: 'track' | 'playlist';
    id: number;
    user: User;
    title: string;
    description?: string;
    duration: number;
    artwork_url: string;
    likes_count?: number;

    // Track
    comment_count?: number;
    playback_count: number;
    download_count: number;
    favoritings_count: number;
    reposts_count: number;
    user_favorite: boolean;

    // Playlist
    track_count?: number;
  };
};

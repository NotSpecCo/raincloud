export type User = {
  id: number;
  username: string;
  kind: 'user';
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  city?: string;
  country?: string;
  website?: string;
  description?: string;
  track_count: number;
  public_favorites_count: number;
  reposts_count: number;
  followers_count: number;
  followings_count: number;
  comments_count: number;
  likes_count: number;
  playlist_count: number;
};

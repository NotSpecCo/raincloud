import type { Track, User } from '../models';
import type { Playlist } from '../models/Playlist';
import { Auth } from './auth';
import { Cache } from './cache';

type Options = {};

export class SoundCloud {
  private options: Options;
  private cache: Cache;

  constructor(options: Partial<Options> = {}) {
    this.options = {
      ...options,
    };
    this.cache = new Cache();
  }

  me = {
    get: async (): Promise<User> => {
      const me = await this.httpGet<User>('me');
      return me;
    },
    getLikedTracks: async (): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        'me/likes/tracks?limit=40&linked_partitioning=true'
      );
      return res.collection;
    },
    getLikedPlaylists: async (): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        'me/likes/playlists?limit=40&linked_partitioning=true'
      );
      return res.collection;
    },
    getFollowing: async (): Promise<User[]> => {
      const res: any = await this.httpGet<User[]>('me/followings?limit=50');
      return res.collection;
    },
  };

  user = {
    get: async (userId: number): Promise<User> => {
      const res = await this.httpGet<User>(`users/${userId}`);
      return res;
    },
    getFollowers: async (userId: number): Promise<User[]> => {
      const res: any = await this.httpGet<User[]>(
        `users/${userId}/followers?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    getFollowings: async (userId: number): Promise<User[]> => {
      const res: any = await this.httpGet<User[]>(
        `users/${userId}/followings?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    getPlaylists: async (userId: number): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        `users/${userId}/playlists?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    getTracks: async (userId: number): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        `users/${userId}/tracks?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    getLikedTracks: async (userId: number): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        `users/${userId}/likes/tracks?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    getLikedPlaylists: async (userId: number): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        `users/${userId}/likes/playlists?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
  };

  track = {
    get: async (trackId: number): Promise<Track> => {
      const res: any = await this.httpGet(`tracks/${trackId}`);
      return res;
    },
    getStreamUrl: async (trackId: number): Promise<string> => {
      const res: any = await this.httpGet(`tracks/${trackId}/streams`, false);
      return res.http_mp3_128_url;
    },
  };

  playlist = {
    get: async (playlistId: number, showTracks = true): Promise<Playlist> => {
      const res: any = await this.httpGet(`playlists/${playlistId}?show_tracks=${showTracks}`);
      return res;
    },
  };

  private async httpGet<T>(url: string, useCache = true): Promise<T> {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    if (useCache) {
      const cached = await this.cache.get<T>(url);

      if (cached) {
        // console.log(`Cache hit: ${url}`, cached);
        return cached.data;
      } else {
        // console.log(`Cache miss: ${url}`);
      }
    }

    const data = await new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('GET', `https://api.soundcloud.com/${url}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.access_token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });

    if (useCache) {
      await this.cache.set(url, data);
    }

    return data as T;
  }
}

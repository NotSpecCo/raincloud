import type { StreamItem, Track, User } from '../models';
import type { Playlist } from '../models/Playlist';
import { Auth } from './auth';
import { Cache } from './cache';

type Options = {};

export class SoundCloud {
  private options: Options;

  constructor(options: Partial<Options> = {}) {
    this.options = {
      ...options,
    };
  }

  me = {
    get: async (): Promise<User> => {
      const me = await this.httpGet<User>('me');
      return me;
    },
    getTracks: async (): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>('me/tracks?limit=50&linked_partitioning=true');
      return res.collection;
    },
    getPlaylists: async (): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        'me/playlists?limit=50&linked_partitioning=true'
      );
      return res.collection;
    },
    getLikedTracks: async (): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        'me/likes/tracks?limit=50&linked_partitioning=true'
      );
      return res.collection;
    },
    getLikedPlaylists: async (): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        'me/likes/playlists?limit=50&linked_partitioning=true'
      );
      return res.collection;
    },
    getFollowing: async (): Promise<User[]> => {
      const res: any = await this.httpGet<User[]>('me/followings?limit=50');
      return res.collection;
    },
    getStream: async (): Promise<StreamItem[]> => {
      const res: any = await this.httpGet<StreamItem[]>('me/activities/all/own?limit=50');
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
    search: async (query: string): Promise<User[]> => {
      const res: any = await this.httpGet<User[]>(
        `users?q=${query}&limit=50&linked_partitioning=true`
      );
      return res.collection
        .sort((a, b) => {
          if (a.followers_count > b.followers_count) return -1;
          if (a.followers_count < b.followers_count) return 1;
          return 0;
        })
        .slice(0, 25);
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
    getRelated: async (trackId: number): Promise<Track[]> => {
      const res: any = await this.httpGet(
        `tracks/${trackId}/related?limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    search: async (query: string): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        `tracks?q=${query}&limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    like: async (trackId: number): Promise<void> => {
      await this.httpPost(`likes/tracks/${trackId}`);
      await Cache.invalidate();
    },
    unlike: async (trackId: number): Promise<void> => {
      await this.httpDelete(`likes/tracks/${trackId}`);
      await Cache.invalidate();
    },
    repost: async (trackId: number): Promise<void> => {
      await this.httpPost(`reposts/tracks/${trackId}`);
      await Cache.invalidate('me/activities/all/own');
    },
    removeRepost: async (trackId: number): Promise<void> => {
      await this.httpDelete(`reposts/tracks/${trackId}`);
      await Cache.invalidate('me/activities/all/own');
    },
  };

  playlist = {
    get: async (playlistId: number, showTracks = true): Promise<Playlist> => {
      const res: any = await this.httpGet(`playlists/${playlistId}?show_tracks=${showTracks}`);
      return res;
    },
    search: async (query: string): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        `playlists?q=${query}&limit=50&linked_partitioning=true`
      );
      return res.collection;
    },
    like: async (playlistId: number): Promise<void> => {
      await this.httpPost(`likes/playlists/${playlistId}`);
      await Cache.invalidate('me/likes/playlists');
    },
    unlike: async (playlistId: number): Promise<void> => {
      await this.httpDelete(`likes/playlists/${playlistId}`);
      await Cache.invalidate('me/likes/playlists');
    },
    repost: async (playlistId: number): Promise<void> => {
      await this.httpPost(`reposts/playlists/${playlistId}`);
      await Cache.invalidate('me/activities/all/own');
    },
    removeRepost: async (playlistId: number): Promise<void> => {
      await this.httpDelete(`reposts/playlists/${playlistId}`);
      await Cache.invalidate('me/activities/all/own');
    },
  };

  private async httpGet<T>(url: string, useCache = true): Promise<T> {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    if (useCache) {
      const cached = await Cache.get<T>(url);

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
      await Cache.set(url, data);
    }

    return data as T;
  }

  private async httpPost(url: string): Promise<void> {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    await new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(null));
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('POST', `https://api.soundcloud.com/${url}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.access_token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });
  }

  private async httpDelete(url: string): Promise<void> {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    await new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(null));
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('DELETE', `https://api.soundcloud.com/${url}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.access_token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });
  }
}

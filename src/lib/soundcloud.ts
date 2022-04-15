import type { Track, User } from '../models';
import type { Playlist } from '../models/Playlist';
import { Auth } from './auth';

type Options = {};

export class SoundCloud {
  private options: Options;

  constructor(options: Partial<Options> = {}) {
    this.options = {
      ...options,
    };
  }

  me = {
    getInfo: async (): Promise<User> => {
      const me = await this.httpGet<User>('me');
      return me;
    },
    getLikedTracks: async (): Promise<Track[]> => {
      const res: any = await this.httpGet<Track[]>(
        'me/likes/tracks?limit=40&linked_partitioning=true&access=playable'
      );
      return res.collection;
    },
    getLikedPlaylists: async (): Promise<Playlist[]> => {
      const res: any = await this.httpGet<Playlist[]>(
        'me/likes/playlists?limit=40&linked_partitioning=true'
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
      const res: any = await this.httpGet(`tracks/${trackId}/streams`);
      return res.http_mp3_128_url;
    },
  };

  playlist = {
    get: async (playlistId: number, showTracks = true): Promise<Playlist> => {
      const res: any = await this.httpGet(
        `playlists/${playlistId}?access=playable&show_tracks=${showTracks}`
      );
      return res;
    },
  };

  private async httpGet<T>(url: string): Promise<T> {
    const tokens = await new Auth().getTokens();
    console.log('tokens', tokens);

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
      xhr.addEventListener('error', () => reject(new Error('Failed to call')));
      xhr.open('GET', `https://api.soundcloud.com/${url}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.access_token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send();
    });
  }
}

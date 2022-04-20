import { get, writable } from 'svelte/store';
import { SoundCloud } from '../lib/soundcloud';
import type { PlaybackProgress } from '../models';

function createPlayer() {
  const { subscribe, update, set } = writable<PlaybackProgress>({
    track: undefined,
    allTracks: [],
    playing: false,
    currentTime: 0,
    duration: 0,
  });

  return {
    subscribe,
    update: function (data: Partial<PlaybackProgress>) {
      update((previous) => ({ ...previous, ...data }));
    },
    reset: function () {
      set({
        track: undefined,
        allTracks: [],
        playing: false,
        currentTime: 0,
        duration: 0,
      });
    },
    loadTrack: async function (trackId: number): Promise<string> {
      const [track, streamUrl] = await Promise.all([
        new SoundCloud().track.get(trackId),
        new SoundCloud().track.getStreamUrl(trackId),
      ]);

      set({
        track,
        allTracks: [track],
        playing: false,
        currentTime: 0,
        duration: 0,
      });

      return streamUrl;
    },
    loadPlaylist: async function (playlistId: number): Promise<string> {
      const playlist = await new SoundCloud().playlist.get(playlistId, true);

      if (playlist.tracks.length === 0) return;

      const [track, streamUrl] = await Promise.all([
        new SoundCloud().track.get(playlist.tracks[0].id),
        new SoundCloud().track.getStreamUrl(playlist.tracks[0].id),
      ]);

      set({
        track,
        allTracks: playlist.tracks,
        playing: false,
        currentTime: 0,
        duration: 0,
      });

      return streamUrl;
    },
    nextTrack: async function (): Promise<string | null> {
      const current = get({ subscribe });
      const index = current.allTracks.findIndex((a) => a.id === current.track.id);
      const track = current.allTracks[index + 1];
      if (!track || index === -1) return null;

      const streamUrl = await new SoundCloud().track.getStreamUrl(track.id);

      update((previous) => ({
        ...previous,
        track: track,
        playing: false,
        currentTime: 0,
        duration: 0,
      }));

      return streamUrl;
    },
    previousTrack: async function (): Promise<string | null> {
      const current = get({ subscribe });
      const index = current.allTracks.findIndex((a) => a.id === current.track.id);
      const track = current.allTracks[index - 1];
      if (!track || index === -1) return null;

      const streamUrl = await new SoundCloud().track.getStreamUrl(track.id);

      update((previous) => ({
        ...previous,
        track: track,
        playing: false,
        currentTime: 0,
        duration: 0,
      }));

      return streamUrl;
    },
  };
}

export const player = createPlayer();

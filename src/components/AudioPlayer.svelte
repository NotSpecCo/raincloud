<script context="module" lang="ts">
  import throttle from 'lodash.throttle';
  import { SoundCloud } from '../lib/soundcloud';
  import type { PlaybackProgress } from '../models/PlaybackProgress';
  import { player } from '../stores/player';
  import { clamp } from '../utils/clamp';

  let audio = new Audio();
  (audio as any).mozAudioChannelType = 'content';

  audio.onloadedmetadata = () => {
    updateStatus({ duration: audio.duration });
  };

  audio.ontimeupdate = throttle(() => {
    updateStatus({ currentTime: audio.currentTime });
  }, 1000);

  export async function load(trackId: number) {
    const [track, streamUrl] = await Promise.all([
      new SoundCloud().track.get(trackId),
      new SoundCloud().track.getStreamUrl(trackId),
    ]);

    audio.src = streamUrl;
    audio.currentTime = 0;

    player.set({
      track,
      currentTime: 0,
      duration: track.duration || 0,
      playing: true,
    });

    audio.play();
  }

  export function play() {
    audio.play();
    updateStatus({ playing: true });
  }

  export function pause() {
    audio.pause();
    updateStatus({ playing: false });
  }

  export function stop() {
    audio.src = '';
    audio.currentTime = 0;
    player.set({
      track: undefined,
      playing: false,
      currentTime: 0,
      duration: 0,
    });
  }

  export function skip(seconds: number) {
    const newTime = clamp(audio.currentTime + seconds, 0, audio.duration);
    audio.currentTime = audio.currentTime + seconds;
    updateStatus({ currentTime: newTime });
  }

  export function skipTo(seconds: number) {
    const newTime = clamp(seconds, 0, audio.duration);
    audio.currentTime = seconds;
    updateStatus({ currentTime: newTime });
  }

  function updateStatus(changes: Partial<PlaybackProgress>) {
    player.update((a) => ({
      ...a,
      ...changes,
    }));
  }
</script>

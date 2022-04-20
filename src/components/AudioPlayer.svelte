<script context="module" lang="ts">
  import throttle from 'lodash.throttle';
  import { player } from '../stores/player';
  import { clamp } from '../utils/clamp';

  let audio = new Audio();
  (audio as any).mozAudioChannelType = 'content';

  audio.onloadedmetadata = () => {
    player.update({ duration: audio.duration });
  };

  audio.ontimeupdate = throttle(() => {
    player.update({ currentTime: audio.currentTime });
  }, 1000);

  audio.onended = async () => {
    nextTrack();
  };

  export async function loadTrack(trackId: number) {
    const streamUrl = await player.loadTrack(trackId);

    audio.src = streamUrl;
    audio.currentTime = 0;

    audio.play();
    player.update({ playing: true });
  }

  export async function loadPlaylist(playlistId: number) {
    const streamUrl = await player.loadPlaylist(playlistId);

    audio.src = streamUrl;
    audio.currentTime = 0;

    audio.play();
    player.update({ playing: true });
  }

  export async function nextTrack() {
    const streamUrl = await player.nextTrack();
    if (!streamUrl) return;

    audio.src = streamUrl;
    audio.currentTime = 0;

    audio.play();
    player.update({ playing: true });
  }

  export async function previousTrack() {
    const streamUrl = await player.previousTrack();
    if (!streamUrl) return;

    audio.src = streamUrl;
    audio.currentTime = 0;

    audio.play();
    player.update({ playing: true });
  }

  export function play() {
    audio.play();
    player.update({ playing: true });
  }

  export function pause() {
    audio.pause();
    player.update({ playing: false });
  }

  export function stop() {
    audio.src = '';
    audio.currentTime = 0;
    player.reset();
  }

  export function skip(seconds: number) {
    const newTime = clamp(audio.currentTime + seconds, 0, audio.duration);
    audio.currentTime = audio.currentTime + seconds;
    player.update({ currentTime: newTime });
  }

  export function skipTo(seconds: number) {
    const newTime = clamp(seconds, 0, audio.duration);
    audio.currentTime = seconds;
    player.update({ currentTime: newTime });
  }
</script>

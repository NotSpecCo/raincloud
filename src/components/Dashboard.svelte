<script lang="ts">
  import KaiOS from 'kaios-lib';
  import Progressbar from 'onyx-ui/components/form/Progressbar.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager } from 'onyx-ui/services';
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';
  import { pause, play, skip, skipTo } from './AudioPlayer.svelte';

  export let open: boolean;

  const keyMan = KeyManager.subscribe(
    {
      onEnter: () => {
        $player.playing ? pause() : play();
        return true;
      },
      onArrowUp: () => {
        new KaiOS.Volume().up().catch(() => {});
        return true;
      },
      onArrowUpLong: () => {
        new KaiOS.Volume().up().catch(() => {});
        return true;
      },
      onArrowDown: () => {
        new KaiOS.Volume().down().catch(() => {});
        return true;
      },
      onArrowLeftLong: () => {
        skipTo(0);
        return true;
      },
      onArrowLeft: () => {
        skip(-10);
        return true;
      },
      onArrowRight: () => {
        skip(30);
        return true;
      },
    },
    Priority.High
  );

  $: {
    open ? keyMan.enable() : keyMan.disable();
  }
</script>

{#if $player.track}
  <div class="root">
    {#if open}
      <div class="open">
        <img src={$player.track.artwork_url} alt="" class="artwork" />
        <div class="title">{$player.track.title}</div>
        <div class="artist">{$player.track.user.username}</div>
        <div class="progress">
          <span class="time">{formatTime($player.currentTime)}</span>
          <div class="progressbar">
            <Progressbar value={($player.currentTime / $player.duration) * 100} />
          </div>
          <span class="time">{formatTime($player.duration)}</span>
        </div>
      </div>
    {:else}
      <div class="closed">
        <div class="track">{$player.track.title} - ${$player.track.user.username}</div>
        <span class="time" style={`color: var(--accent-color);`}
          >{formatTime($player.currentTime)}</span
        >
      </div>
    {/if}
  </div>
{/if}

<style>
  .root {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.88);
    padding: 5px;
  }

  .closed {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .closed > .track {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .closed > .time {
    font-weight: 600;
    margin: 0 3px;
  }

  .open {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .open > .artwork {
    width: 96px;
    height: 96px;
  }
  .open > .title,
  .open > .artist {
    text-align: center;
  }
  .open > .title {
    font-weight: 600;
    margin: 5px 0;
  }
  .open > .progress {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .open > .progress > .progressbar {
    flex: 1;
  }
</style>

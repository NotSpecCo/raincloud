<script lang="ts">
  import { location } from 'svelte-spa-router';
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';
</script>

{#if $player.track && $location.startsWith('/player')}
  <div class="times">
    <span class="time">{formatTime($player.currentTime)}</span>
    <span class="time">{formatTime($player.duration)}</span>
  </div>
{:else if $player.track}
  <div class="miniplayer">
    <div class="track">{$player.track.title} - ${$player.track.user.username}</div>
    <span class="time">{formatTime($player.currentTime)}</span>
  </div>
{/if}

<style>
  .times {
    display: flex;
    justify-content: space-between;
    padding: 5px;
  }
  .miniplayer {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.88);
    padding: 5px;
  }
  .track {
    flex: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .time {
    font-weight: 600;
    margin: 0 3px;
    color: var(--accent-color);
  }
</style>

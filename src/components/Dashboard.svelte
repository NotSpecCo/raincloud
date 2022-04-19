<script lang="ts">
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';
</script>

{#if $player.track}
  <div class="root">
    <div class="closed">
      <div class="track">{$player.track.title} - ${$player.track.user.username}</div>
      <span class="time" style={`color: var(--accent-color);`}
        >{formatTime($player.currentTime)}</span
      >
    </div>
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
</style>

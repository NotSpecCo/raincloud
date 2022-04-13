<script lang="ts">
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';
</script>

{#if $player.track}
  <div class="root">
    <div class="title">{$player.track.title} - ${$player.track.user.username}</div>
    <span class="time" style={`color: var(--accent-color);`}>{formatTime($player.currentTime)}</span
    >
  </div>
{/if}

<style>
  .root {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.88);
    padding: 3px;
  }
  .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .time {
    font-weight: 600;
    margin: 0 3px;
  }
</style>

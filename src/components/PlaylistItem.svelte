<script lang="ts">
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import { Color, IconSize } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import MdAccessTime from 'svelte-icons/md/MdAccessTime.svelte';
  import MdAudiotrack from 'svelte-icons/md/MdAudiotrack.svelte';
  import { push } from 'svelte-spa-router';
  import { loadPlaylist } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models';
  import { settings } from '../stores/settings';
  import { formatTime } from '../utils/formatTime';
  import { getImage } from '../utils/getImage';

  export let playlist: Playlist;
  export let primaryText: string;
  export let secondaryText: string = null;
  export let accentText: string = null;
</script>

<ListItem
  imageUrl={getImage(playlist.artwork_url, 60)}
  {primaryText}
  {secondaryText}
  {accentText}
  navi={{
    itemId: playlist.id.toString(),
    onSelect: () => push(`/playlist/${playlist.id}`),
  }}
  contextMenu={{
    title: playlist.title,
    items: [
      {
        label: 'Play',
        onSelect: async () => {
          loadPlaylist(playlist.id);
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'Like',
        onSelect: async () => {
          await new SoundCloud().playlist.like(playlist.id);
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'Repost',
        onSelect: async () => {
          await new SoundCloud().playlist.repost(playlist.id);
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'View artist',
        onSelect: async () => {
          push(`/user/${playlist.user.id}`);
          Onyx.contextMenu.close();
        },
      },
    ],
  }}
>
  <div slot="bottom">
    {#if $settings.playlistStatsInLists}
      <div class="stats">
        <div class="item">
          <Icon size={IconSize.Smallest} color={Color.Secondary}><MdAccessTime /></Icon>
          {formatTime(playlist.duration / 1000)}
        </div>
        <div class="item">
          <Icon size={IconSize.Smallest} color={Color.Secondary}><MdAudiotrack /></Icon>
          {playlist.track_count} tracks
        </div>
      </div>
    {/if}
  </div>
</ListItem>

<style>
  .stats {
    display: flex;
    color: var(--secondary-text-color);
    font-size: 1.2rem;
  }

  .stats > .item {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
</style>

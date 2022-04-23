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
  import type { Playlist, PlaylistData } from '../models';
  import { settings } from '../stores/settings';
  import { formatTime } from '../utils/formatTime';
  import { getImage } from '../utils/getImage';

  export let playlist: Playlist;
  export let primaryText: string = null;
  export let secondaryText: string = null;
  export let accentText: string = null;

  function getText(playlist: Playlist, data: PlaylistData): string | null {
    switch (data) {
      case 'artist':
        return playlist.user.username;
      case 'duration':
        return formatTime(playlist.duration / 1000);
      case 'title':
        return playlist.title;
      case 'trackCount':
        return `${playlist.track_count} tracks`;
      default:
        return null;
    }
  }
</script>

<ListItem
  imageUrl={getImage(playlist.artwork_url, 60)}
  primaryText={primaryText || getText(playlist, $settings.playlistPrimaryText)}
  secondaryText={secondaryText || getText(playlist, $settings.playlistSecondaryText)}
  accentText={accentText || getText(playlist, $settings.playlistAccentText)}
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
    {#if $settings.playlistStats}
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
    margin-top: 1px;
  }

  .stats > .item {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
</style>

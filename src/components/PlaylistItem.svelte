<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import { Onyx } from 'onyx-ui/services';
  import { push } from 'svelte-spa-router';
  import { loadPlaylist } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models';
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
/>

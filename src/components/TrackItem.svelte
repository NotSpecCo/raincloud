<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import { Onyx } from 'onyx-ui/services';
  import { push } from 'svelte-spa-router';
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Track } from '../models';
  import { getImage } from '../utils/getImage';

  export let track: Track;
  export let primaryText: string;
  export let secondaryText: string;
  export let accentText: string = null;
</script>

<ListItem
  imageUrl={getImage(track.artwork_url, 60)}
  {primaryText}
  {secondaryText}
  {accentText}
  navi={{
    itemId: track.id.toString(),
    onSelect: () => push(`/track/${track.id}`),
  }}
  contextMenu={{
    title: track.title,
    items: [
      {
        label: 'Play',
        onSelect: async () => {
          load(track.id);
          Onyx.contextMenu.close();
        },
      },
      track.user_favorite
        ? {
            label: 'Unlike',
            onSelect: async () => {
              track.user_favorite = false;
              await new SoundCloud().track.unlike(track.id);
              Onyx.contextMenu.close();
            },
          }
        : {
            label: 'Like',
            onSelect: async () => {
              track.user_favorite = true;
              await new SoundCloud().track.like(track.id);
              Onyx.contextMenu.close();
            },
          },
      {
        label: 'Repost',
        onSelect: async () => {
          await new SoundCloud().track.repost(track.id);
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'View artist',
        onSelect: async () => {
          push(`/user/${track.user.id}`);
          Onyx.contextMenu.close();
        },
      },
      {
        label: 'View related tracks',
        onSelect: async () => {
          push(`/track/${track.id}/related`);
          Onyx.contextMenu.close();
        },
      },
    ],
  }}
/>

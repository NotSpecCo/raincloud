<script lang="ts">
  import numeral from 'numeral';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import { Color, IconSize } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import MdFavoriteBorder from 'svelte-icons/md/MdFavoriteBorder.svelte';
  import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
  import MdRepeat from 'svelte-icons/md/MdRepeat.svelte';
  import { push } from 'svelte-spa-router';
  import { loadTrack } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Track, TrackData } from '../models';
  import { settings } from '../stores/settings';
  import { getImage } from '../utils/getImage';

  export let track: Track;
  export let primaryText: string = null;
  export let secondaryText: string = null;
  export let accentText: string = null;

  function getText(track: Track, data: TrackData): string | null {
    switch (data) {
      case 'artist':
        return track.user.username;
      case 'comments':
        return `${track.comment_count?.toLocaleString()} comments`;
      case 'likes':
        return `${track.favoritings_count?.toLocaleString()} likes`;
      case 'plays':
        return `${track.playback_count?.toLocaleString()} plays`;
      case 'reposts':
        return `${track.reposts_count?.toLocaleString()} reposts`;
      case 'title':
        return track.title;
      default:
        return null;
    }
  }
</script>

<ListItem
  imageUrl={getImage(track.artwork_url, 60)}
  primaryText={primaryText || getText(track, $settings.trackPrimaryText)}
  secondaryText={secondaryText || getText(track, $settings.trackSecondaryText)}
  accentText={accentText || getText(track, $settings.trackAccentText)}
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
          loadTrack(track.id);
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
>
  <div slot="bottom">
    {#if $settings.trackStats}
      <div class="stats">
        <div class="item">
          <Icon size={IconSize.Smallest} color={Color.Secondary}><MdPlayArrow /></Icon>
          {numeral(track.playback_count).format('0.[0]a')}
        </div>
        <div class="item">
          <Icon size={IconSize.Smallest} color={Color.Secondary}><MdFavoriteBorder /></Icon>
          {numeral(track.favoritings_count).format('0.[0]a')}
        </div>
        <div class="item">
          <Icon size={IconSize.Smallest} color={Color.Secondary}><MdRepeat /></Icon>
          {numeral(track.reposts_count).format('0.[0]a')}
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

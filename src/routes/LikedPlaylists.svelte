<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { push } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models/Playlist';
  import { getImage } from '../utils/getImage';

  registerView({ dataStatus: DataStatus.Loading });

  let playlists: Playlist[] = [];
  new SoundCloud({}).me
    .getLikedPlaylists()
    .then((res) => {
      playlists = res;
      updateView({ dataStatus: DataStatus.Loaded });
    })
    .catch(() => updateView({ dataStatus: DataStatus.Error }));
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Liked Playlists" />
      <CardContent>
        {#if $view.dataStatus <= DataStatus.Loading}
          <Typography align="center">Loading...</Typography>
        {:else if $view.dataStatus === DataStatus.Error}
          <Typography align="center">Failed to load data</Typography>
        {:else if playlists.length === 0}
          <Typography>No playlists</Typography>
        {:else}
          {#each playlists as playlist, i}
            <ListItem
              imageUrl={getImage(playlist.artwork_url, 60)}
              primaryText={playlist.title}
              secondaryText={playlist.user.username}
              accentText={`${playlist.track_count} tracks`}
              navi={{
                itemId: `${i + 1}`,
                onSelect: () => push(`/playlist/${playlist.id}`),
              }}
            />
          {/each}
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

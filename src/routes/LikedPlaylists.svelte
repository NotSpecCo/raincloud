<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models/Playlist';
  import { getImage } from '../utils/getImage';

  registerView({});

  let status = DataStatus.Init;

  let playlists: Playlist[] = [];
  onMount(async () => {
    status = DataStatus.Loading;
    playlists = await new SoundCloud({}).me.getLikedPlaylists();
    status = DataStatus.Loaded;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Liked Playlists" />
      <CardContent>
        {#if status === DataStatus.Loading}
          <Typography>Loading...</Typography>
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

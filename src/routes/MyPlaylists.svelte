<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import { getImage } from '../utils/getImage';

  registerView({});

  const getData = new SoundCloud({}).me.getPlaylists();

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="My Playlists" />
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as playlist, i (playlist.id)}
            <ListItem
              imageUrl={getImage(playlist.artwork_url, 60)}
              primaryText={playlist.title}
              secondaryText={`${playlist.track_count} tracks`}
              navi={{
                itemId: `${i + 1}`,
                onSelect: () => push(`/playlist/${playlist.id}`),
              }}
              contextMenu={{
                title: playlist.title,
                items: [
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
          {:else}
            <Typography align="center">No playlists</Typography>
          {/each}
        {:catch}
          <Typography align="center">Failed to load data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

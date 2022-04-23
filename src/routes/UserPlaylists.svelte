<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import PlaylistItem from '../components/PlaylistItem.svelte';
  import { SoundCloud } from '../lib/soundcloud';

  export let params: { userId: string };

  registerView({});

  const getData = new SoundCloud({}).user.getPlaylists(Number(params.userId));

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Playlists" />
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as playlist (playlist.id)}
            <PlaylistItem {playlist} primaryText={playlist.title} />
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

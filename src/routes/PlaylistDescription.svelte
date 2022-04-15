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
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models/Playlist';

  export let params: { playlistId: string };

  registerView({});

  let status = DataStatus.Init;
  let playlist: Playlist = null;

  onMount(async () => {
    status = DataStatus.Loading;
    try {
      playlist = await new SoundCloud().playlist.get(Number(params.playlistId), false);
      status = DataStatus.Loaded;
    } catch (err) {
      status = DataStatus.Error;
    }

    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Playlist Description" />
      <CardContent>
        {#if status <= DataStatus.Loading}
          <Typography>Loading...</Typography>
        {:else if status === DataStatus.Error}
          <Typography>Failed to load playlist</Typography>
        {:else}
          <Typography type="title" align="center">{playlist.title}</Typography>
          <Typography type="titleSmall" color="accent" padding="none" align="center"
            >{playlist.user.username}</Typography
          >
          <Typography>{playlist.description}</Typography>
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

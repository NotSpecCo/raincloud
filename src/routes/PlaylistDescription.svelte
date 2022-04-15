<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models/Playlist';

  export let params: { playlistId: string };

  registerView({ dataStatus: DataStatus.Loading });

  let playlist: Playlist = null;
  new SoundCloud({}).playlist
    .get(Number(params.playlistId))
    .then((res) => {
      playlist = res;
      updateView({ dataStatus: DataStatus.Loaded });
    })
    .catch(() => updateView({ dataStatus: DataStatus.Error }));

  registerView({});
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Playlist Description" />
      <CardContent>
        {#if $view.dataStatus <= DataStatus.Loading}
          <Typography align="center">Loading...</Typography>
        {:else if $view.dataStatus === DataStatus.Error}
          <Typography align="center">Failed to load data</Typography>
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

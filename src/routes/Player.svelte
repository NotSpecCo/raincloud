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
  import type { Track } from '../models';
  import { player } from '../stores/player';

  registerView({});

  let tracks: Track[] = null;
  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
    tracks = await new SoundCloud({}).me.getLikedTracks();
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Player" />
      <CardContent>
        {#if !$player.track}
          <Typography>Nothing playing</Typography>
        {:else}
          <div />
          <Typography>{$player.track.title}</Typography>
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

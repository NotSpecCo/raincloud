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
  import { push } from 'svelte-spa-router';
  import StreamEvent from '../components/StreamEvent.svelte';
  import { SoundCloud } from '../lib/soundcloud';

  registerView({});

  const getData = new SoundCloud({}).me.getStream();

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Stream" />
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as item, i}
            <StreamEvent
              data={item}
              navi={{
                itemId: `${i + 1}`,
                onSelect: () => {
                  if (item.origin.kind === 'playlist') {
                    push(`/playlist/${item.origin.id}`);
                  }
                  if (item.origin.kind === 'track') {
                    push(`/track/${item.origin.id}`);
                  }
                },
              }}
            />
          {:else}
            <Typography align="center">Nothing here</Typography>
          {/each}
        {:catch}
          <Typography align="center">Failed to load data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

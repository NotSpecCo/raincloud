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
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import { getImage } from '../utils/getImage';

  export let params: { userId: string };

  registerView({});

  const getData = new SoundCloud({}).user.getTracks(Number(params.userId));

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Tracks" />
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as track, i (track.id)}
            <ListItem
              imageUrl={getImage(track.artwork_url, 60)}
              primaryText={track.title}
              secondaryText={track.user.username}
              navi={{
                itemId: `${i + 1}`,
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
          {:else}
            <Typography align="center">No tracks</Typography>
          {/each}
        {:catch}
          <Typography align="center">Failed to load data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

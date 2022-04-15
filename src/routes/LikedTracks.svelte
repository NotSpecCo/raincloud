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
  import type { Track } from '../models';
  import { getImage } from '../utils/getImage';

  registerView({});

  let tracks: Track[] = null;
  onMount(async () => {
    tracks = await new SoundCloud({}).me.getLikedTracks();
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Liked Tracks" />
      <CardContent>
        {#if tracks === null}
          <Typography>Loading...</Typography>
        {:else if tracks.length === 0}
          <Typography>No tracks</Typography>
        {:else}
          {#each tracks as track, i}
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
                ],
              }}
            />
          {/each}
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

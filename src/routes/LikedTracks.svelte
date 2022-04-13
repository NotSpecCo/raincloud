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
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Track } from '../models';

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
      <CardHeader title="Liked Tracks" />
      <CardContent>
        {#if tracks === null}
          <Typography>Loading...</Typography>
        {:else if tracks.length === 0}
          <Typography>No tracks</Typography>
        {:else}
          {#each tracks as track, i}
            <ListItem
              imageUrl={track.artwork_url}
              primaryText={track.title}
              secondaryText={track.user.username}
              navi={{
                itemId: `${i + 1}`,
              }}
              contextMenu={{
                title: track.title,
                items: [
                  {
                    label: 'Play',
                    onSelect: async () => {
                      console.log('play', track.title);
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

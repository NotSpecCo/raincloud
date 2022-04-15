<script lang="ts">
  import IconButton from 'onyx-ui/components/buttons/IconButton.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
  import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte';
  import MdPlayarrow from 'svelte-icons/md/MdPlayarrow.svelte';
  import { push } from 'svelte-spa-router';
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models/Playlist';
  import { getImage } from '../utils/getImage';

  export let params: { playlistId: string };

  registerView({});

  let status = DataStatus.Init;
  let playlist: Playlist = null;

  async function getPlaylist(playlistId: number | null) {
    if (!playlistId) return;

    status = DataStatus.Loading;
    try {
      playlist = await new SoundCloud().playlist.get(Number(params.playlistId));
      status = DataStatus.Loaded;
    } catch (err) {
      status = DataStatus.Error;
    }

    updateView({ dataStatus: DataStatus.Loaded });
  }

  $: getPlaylist(Number(params?.playlistId));
</script>

<View>
  <ViewContent>
    <Card>
      <CardContent>
        {#if status <= DataStatus.Loading}
          <Typography>Loading...</Typography>
        {:else if status === DataStatus.Error}
          <Typography>Failed to load playlist</Typography>
        {:else}
          <div class="artwork">
            <img src={getImage(playlist.artwork_url, 240)} alt="" />
          </div>
          <Typography type="title" align="center">{playlist.title}</Typography>
          <Typography type="titleSmall" color="accent" padding="none" align="center"
            >{playlist.user.username}</Typography
          >
          <section class="actions">
            <IconButton
              icon={MdPlayarrow}
              color={Color.Primary}
              navi={{
                itemId: `btnPlayAll`,
                onSelect: async () => console.log('play all'),
              }}
            />
            <IconButton
              icon={MdInfoOutline}
              color={Color.Primary}
              navi={{
                itemId: `btnViewDesc`,
                onSelect: async () => push(`/playlist/${playlist.id}/description`),
              }}
            />
            <IconButton
              icon={MdFavorite}
              color={Color.Primary}
              disabled={true}
              navi={{
                itemId: `btnLike`,
                onSelect: () => {},
              }}
            />
          </section>
          <Divider title="tracks" />
          <section class="tracks">
            {#each playlist.tracks as track, i}
              <ListItem
                imageUrl={track.artwork_url}
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
          </section>
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

<style>
  .artwork {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
  }
  .artwork > img {
    border-radius: 6px;
    width: 100%;
  }

  section.actions {
    display: flex;
    justify-content: center;
  }
</style>

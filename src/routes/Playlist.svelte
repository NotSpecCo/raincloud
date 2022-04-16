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
  import { onMount } from 'svelte';
  import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
  import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte';
  import MdPlayarrow from 'svelte-icons/md/MdPlayarrow.svelte';
  import { push } from 'svelte-spa-router';
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import { getImage } from '../utils/getImage';

  export let params: { playlistId: string };

  registerView({});

  const getData = new SoundCloud({}).playlist.get(Number(params.playlistId));

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          <div class="artwork">
            <img src={getImage(data.artwork_url, 240)} alt="" />
          </div>
          <Typography type="title" align="center">{data.title}</Typography>
          <Typography type="titleSmall" color="accent" padding="none" align="center"
            >{data.user.username}</Typography
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
                onSelect: async () => push(`/playlist/${data.id}/description`),
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
            {#each data.tracks as track, i}
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
            {/each}
          </section>
        {:catch}
          <Typography align="center">Failed to load data</Typography>
        {/await}
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

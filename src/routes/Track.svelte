<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import FormRow from 'onyx-ui/components/form/FormRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import MdPlayarrow from 'svelte-icons/md/MdPlayarrow.svelte';
  import { load } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Track } from '../models/Track';
  import { formatTime } from '../utils/formatTime';
  import { getImage } from '../utils/getImage';

  export let params: { trackId: string };

  registerView({ dataStatus: DataStatus.Loading });

  let track: Track;
  new SoundCloud({}).track
    .get(Number(params.trackId))
    .then((res) => {
      track = res;
      updateView({ dataStatus: DataStatus.Loaded });
    })
    .catch(() => updateView({ dataStatus: DataStatus.Error }));
</script>

<View>
  <ViewContent>
    <Card>
      <CardContent>
        {#if $view.dataStatus <= DataStatus.Loading}
          <Typography align="center">Loading...</Typography>
        {:else if $view.dataStatus === DataStatus.Error}
          <Typography align="center">Failed to load data</Typography>
        {:else}
          <div class="artwork">
            <img src={getImage(track.artwork_url, 240)} alt="" />
          </div>
          <Typography type="title" align="center">{track.title}</Typography>
          <Typography type="titleSmall" color="accent" padding="none" align="center"
            >{track.user.username}</Typography
          >
          <Button
            icon={MdPlayarrow}
            title="Play"
            color={Color.Primary}
            navi={{
              itemId: `btnPlay`,
              onSelect: async () => load(track.id),
            }}
          />
          <Divider title="stats" />
          <FormRow label="Duration" navi={{ itemId: `duration` }}
            >{formatTime(track.duration / 1000)}</FormRow
          >
          <FormRow label="Likes" navi={{ itemId: `likes` }}
            >{track.favoritings_count.toLocaleString()}</FormRow
          >
          <FormRow label="Comments" navi={{ itemId: `comments` }}
            >{track.comment_count.toLocaleString()}</FormRow
          >
          <FormRow label="Plays" navi={{ itemId: `plays` }}
            >{track.playback_count.toLocaleString()}</FormRow
          >
          <FormRow label="Reposts" navi={{ itemId: `reposts` }}
            >{track.reposts_count.toLocaleString()}</FormRow
          >
          <Divider title="description" />
          <Typography>{track.description}</Typography>
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
  .artwork > img {
    border-radius: 6px;
  }
</style>

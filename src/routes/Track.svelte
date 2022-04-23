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
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import MdPlayarrow from 'svelte-icons/md/MdPlayarrow.svelte';
  import { loadTrack } from '../components/AudioPlayer.svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import { formatTime } from '../utils/formatTime';
  import { getImage } from '../utils/getImage';

  export let params: { trackId: string };

  registerView({});

  const getData = new SoundCloud({}).track.get(Number(params.trackId));

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
          <Button
            icon={MdPlayarrow}
            title="Play"
            color={Color.Primary}
            navi={{
              itemId: `btnPlay`,
              onSelect: async () => loadTrack(data.id),
            }}
          />
          <Divider title="stats" />
          <FormRow label="Plays" navi={{ itemId: `plays` }}
            >{data.playback_count.toLocaleString()}</FormRow
          >
          <FormRow label="Duration" navi={{ itemId: `duration` }}
            >{formatTime(data.duration / 1000)}</FormRow
          >
          <FormRow label="Likes" navi={{ itemId: `likes` }}
            >{data.favoritings_count.toLocaleString()}</FormRow
          >
          <FormRow label="Reposts" navi={{ itemId: `reposts` }}
            >{data.reposts_count.toLocaleString()}</FormRow
          >
          <FormRow label="Comments" navi={{ itemId: `comments` }}
            >{data.comment_count.toLocaleString()}</FormRow
          >
          <Divider title="description" />
          <Typography>{data.description}</Typography>
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
    width: 128px;
    height: 128px;
  }
</style>

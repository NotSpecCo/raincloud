<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import FormRow from 'onyx-ui/components/form/FormRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { SoundCloud } from '../lib/soundcloud';
  import { formatLocation } from '../utils/formatLocation';
  import { getImage } from '../utils/getImage';

  export let params: { userId: string };

  registerView({});

  const getData = new SoundCloud({}).user.get(Number(params.userId));

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
            <img src={getImage(data.avatar_url, 240)} alt="" />
          </div>
          <section class="bio">
            <Typography type="titleLarge" align="center" padding="none"
              >{data.full_name || data.username}</Typography
            >
            <Typography align="center" color="secondary" padding="none"
              >{formatLocation(data)}</Typography
            >
          </section>
          <Divider title="content" />
          <FormRow label="Tracks" navi={{ itemId: `tracks` }}
            >{data.track_count.toLocaleString()}</FormRow
          >
          <FormRow label="Playlists" navi={{ itemId: `playlists` }}
            >{data.playlist_count.toLocaleString()}</FormRow
          >
          <FormRow label="Reposts" navi={{ itemId: `reposts` }}
            >{data.reposts_count.toLocaleString()}</FormRow
          >
          <Divider title="social" />
          <FormRow label="Followers" navi={{ itemId: `followers` }}
            >{data.followers_count.toLocaleString()}</FormRow
          >
          <FormRow label="Following" navi={{ itemId: `following` }}
            >{data.followings_count.toLocaleString()}</FormRow
          >
          <FormRow label="Likes" navi={{ itemId: `likes` }}
            >{data.likes_count.toLocaleString()}</FormRow
          >
          <FormRow label="Liked" navi={{ itemId: `liked` }}
            >{data.public_favorites_count.toLocaleString()}</FormRow
          >
          <FormRow label="Comments" navi={{ itemId: `comments` }}
            >{data.comments_count.toLocaleString()}</FormRow
          >
          <Divider title="stats" />
          <FormRow label="User ID" navi={{ itemId: `userId` }}>{data.id}</FormRow>
          <FormRow label="Joined" navi={{ itemId: `joined` }}
            >{new Date(data.created_at).toLocaleDateString()}</FormRow
          >
          <FormRow label="Plan" navi={{ itemId: `plan` }}>{data.plan}</FormRow>
          <Divider title="description" />
          <Typography>{data.description || 'No description provided.'}</Typography>
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
</style>

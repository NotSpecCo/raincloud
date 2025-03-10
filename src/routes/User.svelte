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
  import { push } from 'svelte-spa-router';
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
          <FormRow
            label="Tracks"
            navi={{ itemId: `tracks`, onSelect: () => push(`/user/${params.userId}/tracks`) }}
            >{data.track_count.toLocaleString()}</FormRow
          >
          <FormRow
            label="Playlists"
            navi={{ itemId: `playlists`, onSelect: () => push(`/user/${params.userId}/playlists`) }}
            >{data.playlist_count.toLocaleString()}</FormRow
          >
          <FormRow label="Reposts" navi={{ itemId: `reposts`, onSelect: () => {} }}
            >{data.reposts_count.toLocaleString()}</FormRow
          >
          <Divider title="social" />
          <FormRow
            label="Followers"
            navi={{ itemId: `followers`, onSelect: () => push(`/user/${params.userId}/followers`) }}
            >{data.followers_count.toLocaleString()}</FormRow
          >
          <FormRow
            label="Following"
            navi={{ itemId: `following`, onSelect: () => push(`/user/${params.userId}/following`) }}
            >{data.followings_count.toLocaleString()}</FormRow
          >
          <FormRow label="Likes" navi={{ itemId: `likes`, onSelect: () => {} }}
            >{data.likes_count.toLocaleString()}</FormRow
          >
          <FormRow label="Liked" navi={{ itemId: `liked`, onSelect: () => {} }}
            >{data.public_favorites_count.toLocaleString()}</FormRow
          >
          <FormRow label="Comments" navi={{ itemId: `comments`, onSelect: () => {} }}
            >{data.comments_count.toLocaleString()}</FormRow
          >
          <Divider title="stats" />
          <FormRow label="User ID" navi={{ itemId: `userId`, onSelect: () => {} }}
            >{data.id}</FormRow
          >
          <FormRow label="Joined" navi={{ itemId: `joined`, onSelect: () => {} }}
            >{new Date(data.created_at).toLocaleDateString()}</FormRow
          >
          <FormRow label="Plan" navi={{ itemId: `plan`, onSelect: () => {} }}>{data.plan}</FormRow>
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
    padding: 10px;
  }
  .artwork > img {
    border-radius: 50%;
    width: 128px;
    height: 128px;
  }
</style>

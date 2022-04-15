<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import FormRow from 'onyx-ui/components/form/FormRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { SoundCloud } from '../lib/soundcloud';
  import type { User } from '../models';
  import { formatLocation } from '../utils/formatLocation';
  import { getImage } from '../utils/getImage';

  export let params: { userId: string };

  registerView({ dataStatus: DataStatus.Loading });

  let user: User = null;
  new SoundCloud({}).user
    .get(Number(params.userId))
    .then((res) => {
      user = res;
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
            <img src={getImage(user.avatar_url, 240)} alt="" />
          </div>
          <section class="bio">
            <Typography type="titleLarge" align="center" padding="none"
              >{user.full_name || user.username}</Typography
            >
            <Typography align="center" color="secondary" padding="none"
              >{formatLocation(user)}</Typography
            >
          </section>
          <Divider title="content" />
          <FormRow label="Tracks" navi={{ itemId: `tracks` }}
            >{user.track_count.toLocaleString()}</FormRow
          >
          <FormRow label="Playlists" navi={{ itemId: `playlists` }}
            >{user.playlist_count.toLocaleString()}</FormRow
          >
          <FormRow label="Reposts" navi={{ itemId: `reposts` }}
            >{user.reposts_count.toLocaleString()}</FormRow
          >
          <Divider title="social" />
          <FormRow label="Followers" navi={{ itemId: `followers` }}
            >{user.followers_count.toLocaleString()}</FormRow
          >
          <FormRow label="Following" navi={{ itemId: `following` }}
            >{user.followings_count.toLocaleString()}</FormRow
          >
          <FormRow label="Likes" navi={{ itemId: `likes` }}
            >{user.likes_count.toLocaleString()}</FormRow
          >
          <FormRow label="Liked" navi={{ itemId: `liked` }}
            >{user.public_favorites_count.toLocaleString()}</FormRow
          >
          <FormRow label="Comments" navi={{ itemId: `comments` }}
            >{user.comments_count.toLocaleString()}</FormRow
          >
          <Divider title="stats" />
          <FormRow label="User ID" navi={{ itemId: `userId` }}>{user.id}</FormRow>
          <FormRow label="Joined" navi={{ itemId: `joined` }}
            >{new Date(user.created_at).toLocaleDateString()}</FormRow
          >
          <FormRow label="Plan" navi={{ itemId: `plan` }}>{user.plan}</FormRow>
          <Divider title="description" />
          <Typography>{user.description || 'No description provided.'}</Typography>
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
</style>

<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { push } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { User } from '../models';
  import { getImage } from '../utils/getImage';

  registerView({ dataStatus: DataStatus.Loading });

  let users: User[] = [];
  new SoundCloud({}).me
    .getFollowing()
    .then((res) => {
      users = res;
      updateView({ dataStatus: DataStatus.Loaded });
    })
    .catch(() => updateView({ dataStatus: DataStatus.Error }));
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Following" />
      <CardContent>
        {#if $view.dataStatus <= DataStatus.Loading}
          <Typography align="center">Loading...</Typography>
        {:else if $view.dataStatus === DataStatus.Error}
          <Typography align="center">Failed to load data</Typography>
        {:else if users.length === 0}
          <Typography align="center">You're not following anyone</Typography>
        {:else}
          {#each users as user, i}
            <ListItem
              imageUrl={getImage(user.avatar_url, 60)}
              primaryText={user.full_name || user.username}
              secondaryText={`${user.followers_count.toLocaleString()} followers`}
              navi={{
                itemId: `${i + 1}`,
                shortcutKey: getShortcutFromIndex(i),
                onSelect: () => push(`/user/${user.id}`),
              }}
            />
          {/each}
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>

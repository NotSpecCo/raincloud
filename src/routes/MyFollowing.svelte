<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { User } from '../models';

  registerView({});

  let users: User[] = [];
  let status = DataStatus.Init;
  onMount(async () => {
    status = DataStatus.Loading;
    try {
      users = await new SoundCloud({}).me.getFollowing();
      status = DataStatus.Loaded;
    } catch (err) {
      status = DataStatus.Error;
    }
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Following" />
      <CardContent>
        {#if status <= DataStatus.Loading}
          <Typography align="center">Loading...</Typography>
        {:else if status === DataStatus.Error}
          <Typography align="center">Failed to load user</Typography>
        {:else if users.length === 0}
          <Typography align="center">You're not following anyone</Typography>
        {:else}
          {#each users as user, i}
            <ListItem
              imageUrl={user.avatar_url}
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

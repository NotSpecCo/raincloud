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
  import { getImage } from '../utils/getImage';

  registerView({});

  const getData = new SoundCloud({}).me.getFollowing();

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Following" />
      <CardContent>
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as user, i (user.id)}
            <ListItem
              imageUrl={getImage(user.avatar_url, 60)}
              imageStyle="circle"
              primaryText={user.full_name || user.username}
              secondaryText={`${user.followers_count.toLocaleString()} followers`}
              navi={{
                itemId: `${i + 1}`,
                shortcutKey: getShortcutFromIndex(i),
                onSelect: () => push(`/user/${user.id}`),
              }}
            />
          {:else}
            <Typography align="center">You're not following anyone</Typography>
          {/each}
        {:catch}
          <Typography align="center">Failed to load data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

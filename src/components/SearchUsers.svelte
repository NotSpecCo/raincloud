<script lang="ts">
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import InputRow from 'onyx-ui/components/form/InputRow.svelte';
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import { push, querystring, replace } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { User } from '../models';
  import { formatLocation } from '../utils/formatLocation';
  import { getImage } from '../utils/getImage';

  let getData: Promise<User[]> = Promise.resolve([]);

  function search() {
    getData = new SoundCloud().user.search(query);
  }

  let followingIds = [];
  onMount(async () => {
    new SoundCloud().me.getFollowing().then((res) => (followingIds = res.map((a) => a.id)));

    if (query?.length >= 3) {
      search();
      await getData;
      updateView({ dataStatus: DataStatus.Loaded });
    }
  });

  $: query = new URLSearchParams($querystring).get('q') || '';
  $: sort = new URLSearchParams($querystring).get('sort') || 'followers';
</script>

<InputRow
  label="Query"
  value={query}
  placeholder="Enter text..."
  onChange={(val) => replace(`/search/users?q=${val}&sort=${sort}`)}
  onSubmit={() => search()}
/>
<SelectRow
  label="Sort"
  value={sort}
  options={[{ id: 'followers', label: 'Followers' }]}
  onChange={(val) => replace(`/search/users?q=${query}&sort=${val}`)}
/>
<Divider title="Results" />
{#await getData}
  <Typography align="center">Loading...</Typography>
{:then data}
  {#each data as user, i (user.id)}
    <ListItem
      imageUrl={getImage(user.avatar_url, 60)}
      imageStyle="circle"
      primaryText={user.username}
      secondaryText={formatLocation(user)}
      accentText={`${user.followers_count.toLocaleString()} followers`}
      navi={{
        itemId: `${i + 1}`,
        shortcutKey: getShortcutFromIndex(i),
        onSelect: () => push(`/user/${user.id}`),
      }}
      contextMenu={{
        title: user.username,
        items: [
          followingIds.includes(user.id)
            ? {
                label: 'Unfollow',
                onSelect: async () => {
                  await new SoundCloud().user.unfollow(user.id);
                  followingIds = followingIds.filter((a) => a !== user.id);
                  Onyx.contextMenu.close();
                },
              }
            : {
                label: 'Follow',
                onSelect: async () => {
                  await new SoundCloud().user.follow(user.id);
                  followingIds = [...followingIds, user.id];
                  Onyx.contextMenu.close();
                },
              },
        ],
      }}
    />
  {:else}
    <Typography align="center">No results</Typography>
  {/each}
{:catch error}
  <Typography align="center">Failed to load data</Typography>
{/await}

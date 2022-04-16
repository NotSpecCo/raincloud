<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import InputRow from 'onyx-ui/components/form/InputRow.svelte';
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import { push, querystring, replace } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import { getImage } from '../utils/getImage';

  let getData = Promise.resolve([]);

  registerView({});

  function search() {
    getData = new SoundCloud().user.search(query);
  }

  onMount(async () => {
    if (query?.length >= 3) {
      search();
      await getData;
      updateView({ dataStatus: DataStatus.Loaded });
    }
  });

  $: query = new URLSearchParams($querystring).get('q') || '';
  $: type = new URLSearchParams($querystring).get('type') || 'users';
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Search" />
      <CardContent>
        <InputRow
          label="Query"
          value={query}
          placeholder="Enter text..."
          onChange={(val) => replace(`/search?q=${val}&type=${type}`)}
        />
        <SelectRow
          label="Result Type"
          value={type}
          disabled
          options={[
            { id: 'tracks', label: 'Tracks' },
            { id: 'playlists', label: 'Playlists' },
            { id: 'users', label: 'Users' },
          ]}
          onChange={(val) => replace(`/search?q=${query}&type=${val}`)}
        />
        <Button
          title="Search"
          disabled={query.length < 3}
          navi={{
            itemId: `signinCode`,
            onSelect: async () => search(),
          }}
        />
        <Divider title="Results" />
        {#await getData}
          <Typography align="center">Loading...</Typography>
        {:then data}
          {#each data as user, i (user.id)}
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
          {:else}
            <Typography align="center">No results</Typography>
          {/each}
        {:catch error}
          <Typography align="center">Failed to load data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

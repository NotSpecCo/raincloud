<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { querystring, replace } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Playlist } from '../models';
  import PlaylistItem from './PlaylistItem.svelte';
  import Searchbox from './Searchbox.svelte';

  type SortBy = 'favorites';

  let getData: Promise<Playlist[]> = Promise.resolve([]);

  function search() {
    if (query.length < 3) return;

    getData = new SoundCloud().playlist.search(query).then((res) => {
      switch (sort) {
        case 'favorites':
          return res.sort((a, b) => sortData(a, b, 'likes_count')).slice(0, 25);
        default:
          return res.slice(0, 25);
      }
    });
  }

  function sortData(a: Playlist, b: Playlist, property: keyof Playlist) {
    if (a[property] > b[property]) return -1;
    if (a[property] < b[property]) return 1;
    return 0;
  }

  onMount(async () => {
    if (query?.length >= 3) {
      search();
      await getData;
      updateView({ dataStatus: DataStatus.Loaded });
    }
  });

  let query: string;
  let sort: SortBy = 'favorites';
  $: query = new URLSearchParams($querystring).get('q') || '';
  $: sort = (new URLSearchParams($querystring).get('sort') as any) || 'favorites';

  $: {
    console.log('Sort changed:', sort);
    search();
  }
</script>

<Searchbox
  value={query}
  onChange={(val) => replace(`/search/playlists?q=${val}&sort=${sort}`)}
  onSubmit={() => search()}
/>
<!-- <SelectRow
  label="Sort"
  value={sort}
  options={[{ id: 'favorites', label: 'Favorites' }]}
  onChange={(val) => replace(`/search/playlists?q=${query}&sort=${val}`)}
/> -->
{#await getData}
  <Typography align="center">Loading...</Typography>
{:then data}
  {#each data as playlist (playlist.id)}
    <PlaylistItem {playlist} />
  {:else}
    <Typography align="center">No results</Typography>
  {/each}
{:catch error}
  <Typography align="center">Failed to load data</Typography>
{/await}

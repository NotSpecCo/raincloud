<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { querystring, replace } from 'svelte-spa-router';
  import { SoundCloud } from '../lib/soundcloud';
  import type { Track } from '../models';
  import Searchbox from './Searchbox.svelte';
  import TrackItem from './TrackItem.svelte';

  type SortBy = 'plays' | 'favorites' | 'comments';

  let getData: Promise<Track[]> = Promise.resolve([]);

  function search() {
    if (query.length < 3) return;

    getData = new SoundCloud().track.search(query).then((res) => {
      switch (sort) {
        case 'plays':
          return res.sort((a, b) => sortData(a, b, 'playback_count')).slice(0, 25);
        case 'favorites':
          return res.sort((a, b) => sortData(a, b, 'favoritings_count')).slice(0, 25);
        case 'comments':
          return res.sort((a, b) => sortData(a, b, 'comment_count')).slice(0, 25);
        default:
          return res.slice(0, 25);
      }
    });
  }

  function sortData(a: Track, b: Track, property: keyof Track) {
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
  let sort: SortBy = 'plays';
  $: query = new URLSearchParams($querystring).get('q') || '';
  $: sort = (new URLSearchParams($querystring).get('sort') as any) || 'plays';

  $: {
    console.log('Sort changed:', sort);
    search();
  }
</script>

<Searchbox
  value={query}
  onChange={(val) => replace(`/search/tracks?q=${val}&sort=${sort}`)}
  onSubmit={() => search()}
/>
<!-- <SelectRow
  label="Sort"
  value={sort}
  options={[
    { id: 'plays', label: 'Plays' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'comments', label: 'Comments' },
  ]}
  onChange={(val) => replace(`/search/tracks?q=${query}&sort=${val}`)}
/> -->
{#await getData}
  <Typography align="center">Loading...</Typography>
{:then data}
  {#each data as track (track.id)}
    <TrackItem {track} primaryText={track.title} secondaryText={track.user.username} />
  {:else}
    <Typography align="center">No results</Typography>
  {/each}
{:catch error}
  <Typography align="center">Failed to load data</Typography>
{/await}

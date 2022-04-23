<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { registerView, view } from 'onyx-ui/stores/view';
  import { replace } from 'svelte-spa-router';
  import SearchPlaylists from '../components/SearchPlaylists.svelte';
  import SearchTracks from '../components/SearchTracks.svelte';
  import SearchUsers from '../components/SearchUsers.svelte';

  export let params: { cardId: string };

  registerView({
    cards: [
      {
        id: 'users',
        title: 'Search Users',
        onSelect: () => replace(`/search/users`),
      },
      {
        id: 'tracks',
        title: 'Search Tracks',
        onSelect: () => replace(`/search/tracks`),
      },
      {
        id: 'playlists',
        title: 'Search Playlists',
        onSelect: () => replace(`/search/playlists`),
      },
    ],
    activeCardId: params.cardId ?? 'users',
  });
</script>

<View>
  <ViewContent>
    {#if params.cardId === $view.cards[0].id}
      <Card cardId={$view.cards[0].id}>
        <CardHeader />
        <CardContent>
          <SearchUsers />
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[1].id}
      <Card cardId={$view.cards[1].id}>
        <CardHeader />
        <CardContent>
          <SearchTracks />
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[2].id}
      <Card cardId={$view.cards[2].id}>
        <CardHeader />
        <CardContent>
          <SearchPlaylists />
        </CardContent>
      </Card>
    {/if}
  </ViewContent>
</View>

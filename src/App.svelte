<script lang="ts">
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import Router, { location, pop, replace } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import AudioPlayer from './components/AudioPlayer.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import { Auth } from './lib/auth';
  import Home from './routes/Home.svelte';
  import Library from './routes/Library.svelte';
  import LikedAlbums from './routes/LikedAlbums.svelte';
  import LikedPlaylists from './routes/LikedPlaylists.svelte';
  import LikedStations from './routes/LikedStations.svelte';
  import LikedTracks from './routes/LikedTracks.svelte';
  import MyFollowing from './routes/MyFollowing.svelte';
  import MyPlaylists from './routes/MyPlaylists.svelte';
  import MyTracks from './routes/MyTracks.svelte';
  import Player from './routes/Player.svelte';
  import Playlist from './routes/Playlist.svelte';
  import PlaylistDescription from './routes/PlaylistDescription.svelte';
  import Redirect from './routes/Redirect.svelte';
  import SignIn from './routes/SignIn.svelte';
  import Stream from './routes/Stream.svelte';
  import Track from './routes/Track.svelte';
  import { player } from './stores/player';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  const routes = {
    '/home': Home,
    '/signin': SignIn,
    '/stream': Stream,
    '/player': Player,
    '/library': Library,
    '/library/tracks': LikedTracks,
    '/library/playlists': LikedPlaylists,
    '/library/albums': LikedAlbums,
    '/library/stations': LikedStations,
    '/library/following': MyFollowing,
    '/library/mytracks': MyTracks,
    '/library/myplaylists': MyPlaylists,
    '/track/:trackId': Track,
    '/playlist/:playlistId': Playlist,
    '/playlist/:playlistId/description': PlaylistDescription,
    '*': Redirect,
  };

  new Auth().getTokens().catch(() => {
    console.log('Not signed in. Redirecting...');
    replace('/signin');
  });

  let dashboardOpen = false;

  const keyMan = KeyManager.subscribe(
    {
      onBackspace: () => {
        // If on the main screen, let KaiOS minimize the app
        if ($location === '/') {
          console.log('exit app');
          return false;
        }

        pop();
        return true;
      },
      onArrowUpLong: () => {
        if (!$player.track) return true;
        dashboardOpen = true;
        return true;
      },
      onArrowDownLong: () => {
        dashboardOpen = false;
        return true;
      },
    },
    Priority.High
  );

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} />
  <div slot="dashboard">
    {#if $player.track}
      <Dashboard open={dashboardOpen} />
    {/if}
  </div>
  <AudioPlayer />
</OnyxApp>

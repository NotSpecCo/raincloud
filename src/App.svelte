<script lang="ts">
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import Router, { location, pop } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import AudioPlayer from './components/AudioPlayer.svelte';
  import Dashboard from './components/Dashboard.svelte';
  import AppSettings from './routes/AppSettings.svelte';
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
  import RelatedTracks from './routes/RelatedTracks.svelte';
  import SignIn from './routes/SignIn.svelte';
  import Stream from './routes/Stream.svelte';
  import Track from './routes/Track.svelte';
  import User from './routes/User.svelte';
  import UserFollowers from './routes/UserFollowers.svelte';
  import UserFollowing from './routes/UserFollowing.svelte';
  import UserLikedPlaylists from './routes/UserLikedPlaylists.svelte';
  import UserLikedTracks from './routes/UserLikedTracks.svelte';
  import UserPlaylists from './routes/UserPlaylists.svelte';
  import UserTracks from './routes/UserTracks.svelte';
  import { player } from './stores/player';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  const routes = {
    '/home': Home,
    '/library': Library,
    '/library/albums': LikedAlbums,
    '/library/following': MyFollowing,
    '/library/mytracks': MyTracks,
    '/library/myplaylists': MyPlaylists,
    '/library/playlists': LikedPlaylists,
    '/library/stations': LikedStations,
    '/library/tracks': LikedTracks,
    '/player': Player,
    '/playlist/:playlistId': Playlist,
    '/playlist/:playlistId/description': PlaylistDescription,
    '/settings/:cardId': AppSettings,
    '/signin': SignIn,
    '/stream': Stream,
    '/track/:trackId': Track,
    '/track/:trackId/related': RelatedTracks,
    '/user/:userId': User,
    '/user/:userId/followers': UserFollowers,
    '/user/:userId/following': UserFollowing,
    '/user/:userId/liked-playlists': UserLikedPlaylists,
    '/user/:userId/liked-tracks': UserLikedTracks,
    '/user/:userId/playlists': UserPlaylists,
    '/user/:userId/tracks': UserTracks,
    '*': Redirect,
  };

  let dashboardOpen = false;

  // TODO: Fix this in a better way
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Backspace' && $location !== '/home') {
      ev.preventDefault();
    }
  });

  const keyMan = KeyManager.subscribe(
    {
      onBackspace: () => {
        // If on the main screen, let KaiOS minimize the app
        if ($location === '/home') {
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

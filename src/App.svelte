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
  import LikedTracks from './routes/LikedTracks.svelte';
  import Redirect from './routes/Redirect.svelte';
  import SignIn from './routes/SignIn.svelte';
  import Stream from './routes/Stream.svelte';
  import { player } from './stores/player';
  import { settings } from './stores/settings';

  const routes = {
    '/home': Home,
    '/signin': SignIn,
    '/stream': Stream,
    '/likes/tracks': LikedTracks,
    '*': Redirect,
  };

  new Auth().getTokens().catch(() => {
    console.log('Not signed in. Redirecting...');
    replace('/signin');
  });

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
    },
    Priority.Low
  );

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} slot="content" />
  <div slot="dashboard">
    {#if $player.track}
      <Dashboard />
    {/if}
  </div>
  <AudioPlayer />
</OnyxApp>

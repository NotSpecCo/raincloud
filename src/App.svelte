<script lang="ts">
  import Dashboard from 'onyx-ui/components/app/Dashboard.svelte';
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import Router, { location, pop, replace } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import { Auth } from './lib/auth';
  import Home from './routes/Home.svelte';
  import Redirect from './routes/Redirect.svelte';
  import SignIn from './routes/SignIn.svelte';
  import Stream from './routes/Stream.svelte';
  import { settings } from './stores/settings';

  const routes = {
    '/home': Home,
    '/signin': SignIn,
    '/stream': Stream,
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
  <Router {routes} />
  {#if false}
    <Dashboard slot="dashboard">Hello</Dashboard>
  {/if}
</OnyxApp>

<script lang="ts">
  import Dashboard from 'onyx-ui/components/app/Dashboard.svelte';
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import Router, { location, pop } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import Home from './routes/Home.svelte';
  import Redirect from './routes/Redirect.svelte';
  import { settings } from './stores/settings';

  const routes = {
    '/': Home,
    '*': Redirect,
  };

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

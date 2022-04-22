<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize, ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import MdInfoOutline from 'svelte-icons/md/MdInfoOutline.svelte';
  import MdLibraryMusic from 'svelte-icons/md/MdLibraryMusic.svelte';
  import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
  import MdSearch from 'svelte-icons/md/MdSearch.svelte';
  import MdSettings from 'svelte-icons/md/MdSettings.svelte';
  import MdViewStream from 'svelte-icons/md/MdViewStream.svelte';
  import { location, push } from 'svelte-spa-router';
  import { Auth } from '../lib/auth';
  import type { AuthSession } from '../models';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'library', text: 'Library', route: '/library', icon: MdLibraryMusic },
    { id: 'stream', text: 'Stream', route: '/stream', icon: MdViewStream },
    { id: 'search', text: 'Search', route: '/search/users', icon: MdSearch },
    { id: 'player', text: 'Player', route: '/player/info', icon: MdPlayArrow },
    { id: 'settings', text: 'Settings', route: '/settings/display', icon: MdSettings },
    { id: 'about', text: 'About', route: '/about', icon: MdInfoOutline },
  ];

  let session: AuthSession;
  onMount(() => {
    new Auth().getSession().then((res) => (session = res));
  });
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img src="images/icon_56.png" alt="" class="logo" />
    RainCloud
  </div>
  <div class="scroller" data-nav-scroller>
    {#if session}
      <ListItem
        imageUrl={session.user_avatar_url}
        imageStyle="circle"
        imageSize={IconSize.Small}
        primaryText="My Profile"
        navi={{
          itemId: 'profile',
          shortcutKey: getShortcutFromIndex(0),
          onSelect: () => {
            Onyx.appMenu.close();
            if ($location === '/profile') {
              updateView({ viewing: ViewState.Card });
              return;
            }
            push('/profile');
          },
        }}
      />
    {/if}
    {#each menuItems as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i + 1),
          onSelect: () => {
            Onyx.appMenu.close();
            if ($location === item.route) {
              updateView({ viewing: ViewState.Card });
              return;
            }
            push(item.route);
          },
        }}
      />
    {/each}
  </div>
</NavGroup>

<style>
  :global([data-nav-group-id='app-menu']) {
    border-radius: var(--radius) var(--radius) 0 0;
    background-color: var(--card-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    padding: 5px;
    font-weight: var(--bold-font-weight);
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
  }
  .header > .logo {
    height: 32px;
    width: 32px;
    margin-right: 5px;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
</style>

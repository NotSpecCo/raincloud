<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import MdHome from 'svelte-icons/md/MdHome.svelte';
  import MdLibraryMusic from 'svelte-icons/md/MdLibraryMusic.svelte';
  import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
  import MdSearch from 'svelte-icons/md/MdSearch.svelte';
  import MdSettings from 'svelte-icons/md/MdSettings.svelte';
  import MdViewStream from 'svelte-icons/md/MdViewStream.svelte';
  import { push } from 'svelte-spa-router';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'home', text: 'Home', route: '/home', icon: MdHome },
    { id: 'library', text: 'Library', route: '/library', icon: MdLibraryMusic },
    { id: 'stream', text: 'Stream', route: '/stream', icon: MdViewStream },
    { id: 'player', text: 'Player', route: '/player/info', icon: MdPlayArrow },
    { id: 'search', text: 'Search', route: '/search', icon: MdSearch },
    { id: 'settings', text: 'Settings', route: '/settings/display', icon: MdSettings },
  ];
</script>

<NavGroup groupId="app-menu">
  <div class="header">RainCloud</div>
  <div class="scroller" data-nav-scroller>
    {#each menuItems as item, i}
      <ListItem
        icon={item.icon}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i),
          onSelect: () => {
            Onyx.appMenu.close();
            if (location.hash.startsWith(`#${item.route}`)) {
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
    text-align: center;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
</style>

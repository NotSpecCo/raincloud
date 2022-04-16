<script lang="ts">
  import { formatDistanceToNowStrict } from 'date-fns';
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import type { ContextMenu, Navigation } from 'onyx-ui/models';
  import type { StreamItem } from '../models';
  import { getImage } from '../utils/getImage';

  export let data: StreamItem;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;

  function getAction() {
    let action = '';
    switch (data.type) {
      case 'playlist':
        action = 'posted a playlist';
        break;
      case 'track':
        action = 'posted a track';
        break;
      case 'playlist:repost':
        action = 'reposted a playlist';
        break;
      case 'track:repost':
        action = 'reposted a track';
        break;
      default:
        action = 'posted';
    }

    return `${action} ${formatDistanceToNowStrict(new Date(data.created_at), { addSuffix: true })}`;
  }
</script>

<NavItem {navi} {contextMenu}>
  <div class="root">
    <header>
      <img src={getImage(data.origin.user.avatar_url, 60)} alt="" class="avatar" />
      <div class="info">
        <div class="name">{data.origin.user.username}</div>
        <div class="action">{getAction()}</div>
      </div>
    </header>
    <section>
      {#if data.origin.artwork_url}
        <img src={getImage(data.origin.artwork_url, 60)} alt="" class="artwork" />
      {/if}
      <div class="title">{data.origin.title}</div>
    </section>
  </div>
</NavItem>

<style>
  .root {
    padding: 7px 5px;
    border-bottom: 1px solid var(--divider-color);
  }

  header {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
  header .avatar {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    margin-right: 5px;
  }
  header .info {
    line-height: 1.2;
  }
  header .name {
    font-weight: 600;
  }
  header .action {
    color: var(--secondary-text-color);
  }

  section {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
  }
  section .artwork {
    height: 38px;
    width: 38px;
    border-radius: 4px;
    margin-right: 5px;
  }
  section .title {
    overflow: hidden;
    max-height: 38px;
    line-height: 1.3;
  }

  footer {
    display: flex;
    justify-content: space-between;
    color: var(--secondary-text-color);
  }
</style>

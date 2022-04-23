<script lang="ts">
  import { focus } from 'onyx-ui/actions/focus';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import { IconSize } from 'onyx-ui/enums';
  import type { ContextMenu } from 'onyx-ui/models';
  import MdSearch from 'svelte-icons/md/MdSearch.svelte';

  export let value: string;
  export let contextMenu: ContextMenu = null;
  export let onChange: (val: string) => void;
  export let onSubmit: () => void = undefined;

  let focused = false;

  function handleChange(ev: Event) {
    onChange((ev.target as HTMLElement).textContent);
  }
</script>

<NavItem
  navi={{
    itemId: 'inpSearch',
    onFocus: () => (focused = true),
    onBlur: () => (focused = false),
    onSelect: () => onSubmit?.(),
  }}
  {contextMenu}
>
  <div class="root">
    <Icon size={IconSize.Small}><MdSearch /></Icon>
    {#if value?.length === 0 && !focused}
      <div class="placeholder" use:focus={{ focused }}>Search...</div>
    {:else}
      <div
        class="input"
        class:focused
        role="textbox"
        contenteditable
        use:focus={{ focused }}
        on:input={handleChange}
        on:keydown={(ev) => {
          if (ev.key === 'Enter') ev.preventDefault();
        }}
        on:keyup={(ev) => {
          if (ev.key === 'Enter') ev.preventDefault();
        }}
      >
        {value}
      </div>
    {/if}
  </div>
</NavItem>

<style>
  .root {
    padding: 7px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--secondary-text-color);
  }
  .input,
  .placeholder {
    flex: 1;
    min-height: 24px;
    min-width: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    outline: none;
    padding-left: 5px;
  }
  .placeholder {
    color: var(--tertiary-text-color);
  }

  .input.focused {
    border-color: var(--accent-color);
  }
</style>

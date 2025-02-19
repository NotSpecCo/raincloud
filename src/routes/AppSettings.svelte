<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import ConfirmButton from 'onyx-ui/components/buttons/ConfirmButton.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ColorPickerRow from 'onyx-ui/components/form/ColorPickerRow.svelte';
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import ToggleRow from 'onyx-ui/components/form/ToggleRow.svelte';
  import ListHeader from 'onyx-ui/components/list/ListHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Animations, Color, DataStatus, TextSize, TextWeight } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { push, replace } from 'svelte-spa-router';
  import { Auth } from '../lib/auth';
  import { Cache } from '../lib/cache';
  import type { Settings } from '../models';
  import { settings } from '../stores/settings';
  import { themes } from '../themes';

  export let params: { cardId: string };

  registerView({
    cards: [
      {
        id: 'display',
        title: 'Display',
        onSelect: () => replace(`/settings/display`),
      },
      {
        id: 'features',
        title: 'Features',
        onSelect: () => replace(`/settings/features`),
      },
      {
        id: 'lists',
        title: 'Lists',
        onSelect: () => replace(`/settings/lists`),
      },
      {
        id: 'misc',
        title: 'Misc',
        onSelect: () => replace(`/settings/misc`),
      },
    ],
    activeCardId: params.cardId ?? 'display',
  });

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });

  function handleChange(key: keyof Settings, val: any) {
    settings.updateOne(key, val);

    if (key === 'themeId') {
      const theme = themes.find((a) => a.id === $settings.themeId) ?? themes[0];
      settings.update({
        accentColorH: theme.values.accentColorH,
        accentColorS: theme.values.accentColorS,
        accentColorL: theme.values.accentColorL,
        cardColorH: theme.values.cardColorH,
        cardColorS: theme.values.cardColorS,
        cardColorL: theme.values.cardColorL,
        textColorH: theme.values.textColorH,
        textColorS: theme.values.textColorS,
        textColorL: theme.values.textColorL,
        focusColorA: theme.values.focusColorA,
        dividerColorA: theme.values.dividerColorA,
      });
    }
  }
</script>

<View>
  <ViewContent>
    {#if params.cardId === $view.cards[0].id}
      <Card cardId={$view.cards[0].id}>
        <CardHeader />
        <CardContent>
          <ListHeader title="General" />
          <SelectRow
            label="Theme"
            value={$settings.themeId}
            options={[
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
            onChange={(val) => handleChange('themeId', val)}
          />
          <ColorPickerRow
            label="Accent Color"
            value={{
              h: $settings.accentColorH,
              s: $settings.accentColorS,
              l: $settings.accentColorL,
            }}
            onChange={(val) =>
              settings.update({
                accentColorH: val.h,
                accentColorS: val.s,
                accentColorL: val.l,
              })}
          />
          <SelectRow
            label="Animation Speed"
            value={$settings.animationSpeed}
            options={[
              { id: Animations.Instant, label: 'Instant' },
              { id: Animations.Fast, label: 'Fast' },
              { id: Animations.Normal, label: 'Normal' },
              { id: Animations.Slow, label: 'Slow' },
            ]}
            onChange={(val) => handleChange('animationSpeed', val)}
          />
          <ListHeader title="Text" />
          <SelectRow
            label="Size"
            value={$settings.textSize}
            options={[
              { id: TextSize.Smallest, label: 'Smallest' },
              { id: TextSize.Small, label: 'Small' },
              { id: TextSize.Medium, label: 'Medium' },
              { id: TextSize.Large, label: 'Large' },
              { id: TextSize.Largest, label: 'Largest' },
            ]}
            onChange={(val) => handleChange('textSize', val)}
          />
          <SelectRow
            label="Weight"
            value={$settings.textWeight}
            options={[
              { id: TextWeight.Light, label: 'Light' },
              { id: TextWeight.Medium, label: 'Medium' },
              { id: TextWeight.Heavy, label: 'Heavy' },
            ]}
            onChange={(val) => handleChange('textWeight', val)}
          />
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[1].id}
      <Card cardId={$view.cards[1].id}>
        <CardHeader />
        <CardContent>
          <div>features</div>
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[2].id}
      <Card cardId={$view.cards[2].id}>
        <CardHeader />
        <CardContent>
          <ListHeader
            title="Shortcut Keys"
            helpText="Quickly access items in a list with the 1-9 keys."
          />
          <ToggleRow
            label="Enable"
            value={$settings.enableShortcutKeys}
            onChange={(val) => handleChange('enableShortcutKeys', val)}
          />
          <SelectRow
            label="Position"
            value={$settings.shortcutKeyLocation}
            options={[
              { id: 'left', label: 'Left' },
              { id: 'right', label: 'Right' },
              { id: 'hidden', label: 'Hidden' },
            ]}
            onChange={(val) => handleChange('shortcutKeyLocation', val)}
          />
          <SelectRow
            label="Color"
            value={$settings.shortcutKeyColor}
            options={[
              { id: 'primary', label: 'Primary' },
              { id: 'secondary', label: 'Secondary' },
              { id: 'accent', label: 'Accent' },
            ]}
            onChange={(val) => handleChange('shortcutKeyColor', val)}
          />
          <ListHeader title="Tracks" helpText="Customize how tracks are displayed in lists." />
          <SelectRow
            label="Primary Text"
            value={$settings.trackPrimaryText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'comments', label: 'Comments' },
              { id: 'likes', label: 'Likes' },
              { id: 'plays', label: 'Plays' },
              { id: 'reposts', label: 'Reposts' },
              { id: 'title', label: 'Title' },
            ]}
            onChange={(val) => handleChange('trackPrimaryText', val)}
          />
          <SelectRow
            label="Secondary Text"
            value={$settings.trackSecondaryText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'comments', label: 'Comments' },
              { id: 'likes', label: 'Likes' },
              { id: 'plays', label: 'Plays' },
              { id: 'reposts', label: 'Reposts' },
              { id: 'title', label: 'Title' },
              { id: 'none', label: 'None' },
            ]}
            onChange={(val) => handleChange('trackSecondaryText', val)}
          />
          <SelectRow
            label="Accent Text"
            value={$settings.trackAccentText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'comments', label: 'Comments' },
              { id: 'likes', label: 'Likes' },
              { id: 'plays', label: 'Plays' },
              { id: 'reposts', label: 'Reposts' },
              { id: 'title', label: 'Title' },
              { id: 'none', label: 'None' },
            ]}
            onChange={(val) => handleChange('trackAccentText', val)}
          />
          <ToggleRow
            label="Show stats bar"
            value={$settings.trackStats}
            onChange={(val) => handleChange('trackStats', val)}
          />
          <ListHeader
            title="Playlists"
            helpText="Customize how playlists are displayed in lists."
          />
          <SelectRow
            label="Primary Text"
            value={$settings.playlistPrimaryText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'duration', label: 'Duration' },
              { id: 'title', label: 'Title' },
              { id: 'trackCount', label: 'Track Count' },
            ]}
            onChange={(val) => handleChange('playlistPrimaryText', val)}
          />
          <SelectRow
            label="Secondary Text"
            value={$settings.playlistSecondaryText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'duration', label: 'Duration' },
              { id: 'title', label: 'Title' },
              { id: 'trackCount', label: 'Track Count' },
              { id: 'none', label: 'None' },
            ]}
            onChange={(val) => handleChange('playlistSecondaryText', val)}
          />
          <SelectRow
            label="Accent Text"
            value={$settings.playlistAccentText}
            options={[
              { id: 'artist', label: 'Artist' },
              { id: 'duration', label: 'Duration' },
              { id: 'title', label: 'Title' },
              { id: 'trackCount', label: 'Track Count' },
              { id: 'none', label: 'None' },
            ]}
            onChange={(val) => handleChange('playlistAccentText', val)}
          />
          <ToggleRow
            label="Show stats bar"
            value={$settings.playlistStats}
            onChange={(val) => handleChange('playlistStats', val)}
          />
          <ListHeader title="Other" />
          <ToggleRow
            label="Context menu indicators"
            value={$settings.contextMenuIndicators}
            onChange={(val) => handleChange('contextMenuIndicators', val)}
          />
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[3].id}
      <Card cardId={$view.cards[3].id}>
        <CardHeader />
        <CardContent>
          <ListHeader
            title="Help Text"
            helpText="In some places, extra information is shown to help the user know what's going on."
          />
          <ToggleRow
            label="Enabled"
            value={$settings.showHelpText}
            onChange={(val) => handleChange('showHelpText', val)}
          />
          <ListHeader title="Actions" />
          <Button
            title="Clear Cache"
            navi={{
              itemId: `btnClearCache`,
              onSelect: () => {
                Cache.invalidate();
                Onyx.toaster.show({
                  title: 'Cache cleared',
                  type: 'success',
                });
              },
            }}
          />
          <ConfirmButton
            title="Sign Out"
            color={Color.Accent}
            confirmText="Yes, sign out"
            onConfirm={() => {
              new Auth().clearSession();
              push('/signin');
              Onyx.toaster.show({
                title: 'Successfully signed out',
                type: 'success',
              });
            }}
            onCancel={() => {}}
          />
        </CardContent>
      </Card>
    {/if}
  </ViewContent>
</View>

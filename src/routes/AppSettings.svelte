<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ColorPickerRow from 'onyx-ui/components/form/ColorPickerRow.svelte';
  import SelectRow from 'onyx-ui/components/form/SelectRow.svelte';
  import ToggleRow from 'onyx-ui/components/form/ToggleRow.svelte';
  import ListHeader from 'onyx-ui/components/list/ListHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Animations, DataStatus, TextSize, TextWeight } from 'onyx-ui/enums';
  import { registerView, updateView, view } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
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
            options={[{ id: 'light', label: 'Light' }]}
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
          <ListHeader title="Shortcut Keys" />
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
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[2].id}
      <Card cardId={$view.cards[2].id}>
        <CardHeader />
        <CardContent>
          <ToggleRow
            label="Show Help Text"
            value={$settings.showHelpText}
            onChange={(val) => handleChange('showHelpText', val)}
          />
          <Button
            title="Clear Cache"
            navi={{
              itemId: `btnClearCache`,
              onSelect: () => Cache.invalidate(),
            }}
          />
        </CardContent>
      </Card>
    {/if}
  </ViewContent>
</View>

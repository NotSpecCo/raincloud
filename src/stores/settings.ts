import { Animations, Density, TextSize, TextWeight } from 'onyx-ui/enums';
import { Storage } from 'onyx-ui/services';
import { writable } from 'svelte/store';
import type { Settings } from '../models';
import { themes } from '../themes';

const defaultSettings: Settings = {
  // Onyx
  themeId: themes[0].id,
  textSize: TextSize.Medium,
  textWeight: TextWeight.Medium,
  displayDensity: Density.Normal,
  borderRadius: 0,
  animationSpeed: Animations.Normal,
  showHelpText: true,
  enableShortcutKeys: true,
  shortcutKeyLocation: 'left',
  shortcutKeyColor: 'accent',
  contextMenuIndicators: true,
  accentColorH: themes[0].values.accentColorH,
  accentColorS: themes[0].values.accentColorS,
  accentColorL: themes[0].values.accentColorL,
  cardColorH: themes[0].values.cardColorH,
  cardColorS: themes[0].values.cardColorS,
  cardColorL: themes[0].values.cardColorL,
  textColorH: themes[0].values.textColorH,
  textColorS: themes[0].values.textColorS,
  textColorL: themes[0].values.textColorL,
  focusColorA: themes[0].values.focusColorA,
  dividerColorA: themes[0].values.dividerColorA,
  toasterLocation: 'bottom',
  toasterDuration: 3000,
  // App
  trackPrimaryText: 'title',
  trackSecondaryText: 'artist',
  trackAccentText: 'none',
  trackStats: true,
  playlistPrimaryText: 'title',
  playlistSecondaryText: 'artist',
  playlistAccentText: 'none',
  playlistStats: true,
};

const storedSettings = Storage.get<Settings>('settings');

function createSettings() {
  const { subscribe, update } = writable<Settings>({
    ...defaultSettings,
    ...storedSettings,
  });

  subscribe((val) => {
    Storage.set('settings', val);
  });

  return {
    subscribe,
    update: function (data: Partial<Settings>) {
      update((previous) => ({ ...previous, ...data }));
    },
    updateOne: function <T extends keyof Settings>(key: T, value: Settings[T]) {
      update((previous) => ({ ...previous, [key]: value }));
    },
  };
}

export const settings = createSettings();

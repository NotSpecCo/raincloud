# RainCloud

A SoundCloud client for KaiOS.

![Dashboard view](/promo/device_banner.png?raw=true)

### Welcome to the beta!

This is very much a work in progress. Keep your eye on the changelog to see what's new!

### How to run on a KaiOS device

1. Connect your KaiOS device to your computer and make sure it appears in WebIDE (Waterfox Classic is recommended)
2. Build the app with `npm run build`
3. In WebIDE, load the `/public` folder as a packaged app
4. On your computer, visit the [RainCloud website](https://app.vulpine.fm/) to sign into SoundCloud
5. In the app, select 'Sign In via QR Code' and scan the code on your screen. \*You may have to exit and reopen the app to scan the code after giving permission
6. When you scan the code, you're in!

### How to run in a browser locally

This is great for development and testing purposes.

1. [Create a KaiOS device profile in Chrome](https://github.com/garredow/foxcasts-lite#running-locally)
2. Start the dev server with `npm run dev`
3. Open http://localhost:3000
4. In the app, select 'Sign In via Website'

All interaction is done using the keyboard.

- Arrows keys to navigate lists and tabs
- 1-9 are used as shortcuts in grids and lists
- Backspace to navigate back a screen
- Enter to perform the displayed action
- Shift+LeftArrow and Shift+RightArrow to trigger left and right nav bar actions

### Navigation tips

- Right Soft Key (RSK) while a list item is selected will open its context menu, where you can choose to play.
- Left Soft Key (LSK) opens the app menu.
- With the player open, Left will skip back 10 seconds, Right will skip forward 30 seconds, while Up and Down control volume.

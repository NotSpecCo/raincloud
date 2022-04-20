# RainCloud

A SoundCloud client for KaiOS.

![Dashboard view](/promo/device_banner.png?raw=true)

### Welcome to the beta!

This is very much a work in progress. Keep your eye on the changelog to see what's new!

Some things to know:

- Right Soft Key (RSK) while a list item is selected will open its context menu, where you can choose to play.
- Left Soft Key (LSK) opens the app menu.
- With the player open, Left will skip back 10 seconds, Right will skip forward 30 seconds, while Up and Down control volume.

### How to use

1. Build the app and load through WebIDE (see instructions below).
2. On your computer, visit the [RainCloud website](https://app.vulpine.fm/) to sign into SoundCloud.
3. In the app, select 'Sign In via QR Code' and scan the code on your screen. \*You may have to exit and reopen the app to scan the code after giving permission.
4. When you scan the code, you're in!

### Development and testing

`npm run dev` builds the app in watch mode and serves the site. Great for testing your app in a desktop browser.

### Deploying to a device

1. Connect your device to your computer and make sure it appears in WebIDE.
2. `npm run build`
3. In WebIDE, load the `/public` folder as a packaged app.

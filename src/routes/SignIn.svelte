<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import { Auth } from '../lib/auth';

  const code = new URL(window.location.href).searchParams.get('code');
  if (code) {
    new Auth().fetchTokensFromCode(code).then((tokens) => {
      replace('/library');
    });
  }

  registerView({});

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });

  async function signinCode() {
    await new Auth().fetchTokensFromQRCode();
    replace('/library');
  }

  function signinWeb() {
    new Auth().initiateWebLogin();
  }
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Sign In" />
      <CardContent>
        <Typography>Hey, welcome to RainCloud!</Typography>
        <Typography
          >Sorry for the odd sign in process. The SoundCloud signin form is too modern for KaiOS and
          doesn't work.</Typography
        >
        <Typography
          >1. Visit <Typography display="inline" padding="none" color="accent"
            >https://raincloud.fm/login/kaios</Typography
          > on another device.</Typography
        >
        <Typography>2. Sign into SoundCloud.</Typography>
        <Typography
          >3. Click the button below to scan the QR code. If you're having issues scanning, try
          closing an reopening the app.</Typography
        >

        <Button
          title="Sign In via QR Code"
          navi={{
            itemId: `signinCode`,
            onSelect: async () => signinCode(),
          }}
        />
        <Typography
          >In you're running RainCloud in a browser, you can sign in via the SoundCloud website.</Typography
        >
        <Button
          title="Sign In via Website"
          navi={{
            itemId: `signinWeb`,
            onSelect: async () => signinWeb(),
          }}
        />
      </CardContent>
    </Card>
  </ViewContent>
</View>

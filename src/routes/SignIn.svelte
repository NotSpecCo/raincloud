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

  const code = location.href.match(/code=([A-Za-z0-9-_]+)/)?.[1];
  if (code) {
    new Auth().fetchTokensFromCode(code).then((tokens) => {
      window.dispatchEvent(new CustomEvent('tokens'));
      window.close();
    });
  }

  registerView({});

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });

  function signin() {
    const url = new URL('https://api.soundcloud.com/connect');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', 'Gbv3N4cjTjVMwfaHVbCdEB7W5Y3JQM28');
    url.searchParams.append('redirect_uri', 'http://localhost:3000');

    const windowRef = window.open(url.toString());

    // TODO: Why don't these work?
    windowRef.addEventListener('close', () => console.log('window closed'));
    windowRef.addEventListener('tokens', (ev) => console.log('got tokens listener', ev));

    const interval = setInterval(async () => {
      const tokens = await new Auth().getTokens();
      if (tokens) {
        clearInterval(interval);
        replace('/home');
      }
    }, 500);
  }
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Sign In" />
      <CardContent>
        <Typography>Hey! Click the button below to sign in to SoundCloud.</Typography>
        <Button
          title="Sign In"
          navi={{
            itemId: `signin`,
            onSelect: async () => signin(),
          }}
        />
      </CardContent>
    </Card>
  </ViewContent>
</View>

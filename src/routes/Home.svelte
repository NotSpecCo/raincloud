<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { SoundCloud } from '../lib/soundcloud';

  registerView({});

  let me = null;
  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
    me = await new SoundCloud({}).me.getInfo();
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Home" />
      <CardContent>
        <Typography>Hello, {me?.first_name}</Typography>
      </CardContent>
    </Card>
  </ViewContent>
</View>

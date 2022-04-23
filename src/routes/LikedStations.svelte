<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { registerView } from 'onyx-ui/stores/view';

  registerView({});
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Liked Stations" />
      <CardContent>
        <Typography align="center">No stations</Typography>
      </CardContent>
    </Card>
  </ViewContent>
</View>

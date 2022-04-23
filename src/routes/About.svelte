<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { registerView } from 'onyx-ui/stores/view';
  import pkg from '../../package.json';
  import Logo from '../components/Logo.svelte';

  registerView({});
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="About" />
      <CardContent>
        <div class="info">
          <div class="logo">
            <Logo size={128} />
          </div>
          <div class="name">RainCloud</div>
          <Typography color="secondary" padding="none">{`v${pkg.version}`}</Typography>
        </div>
      </CardContent>
    </Card>
  </ViewContent>
</View>

<style>
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    padding: 15px;
  }
  .name {
    font-size: 2rem;
    font-weight: 600;
  }
</style>

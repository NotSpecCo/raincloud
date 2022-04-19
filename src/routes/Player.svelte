<script lang="ts">
  import KaiOS from 'kaios-lib';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager } from 'onyx-ui/services';
  import { registerView, view } from 'onyx-ui/stores/view';
  import { onDestroy } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import { pause, play, skip, skipTo } from '../components/AudioPlayer.svelte';
  import Waveform from '../components/Waveform.svelte';
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';

  export let params: { cardId: string };

  registerView({
    cards: [
      {
        id: 'info',
        title: 'Player',
        onSelect: () => replace(`/player/info`),
      },
    ],
    activeCardId: params.cardId ?? 'info',
  });

  const keyMan = KeyManager.subscribe(
    {
      onEnter: () => {
        $player.playing ? pause() : play();
        return true;
      },
      onArrowUp: () => {
        new KaiOS.Volume().up().catch(() => {});
        return true;
      },
      onArrowDown: () => {
        new KaiOS.Volume().down().catch(() => {});
        return true;
      },
      onArrowLeftLong: () => {
        skipTo(0);
        return true;
      },
      onArrowLeft: () => {
        skip(-10);
        return true;
      },
      onArrowRightLong: () => {
        skipTo($player.duration - 2);
        return true;
      },
      onArrowRight: () => {
        skip(30);
        return true;
      },
    },
    Priority.High
  );

  $: {
    if ($player.track) keyMan.enable();
    else keyMan.disable();
  }

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewContent>
    {#if !$player.track}
      <Card>
        <CardHeader title="Player" />
        <CardContent>
          <Typography align="center">Nothing playing</Typography>
        </CardContent>
      </Card>
    {:else if params.cardId === $view.cards[0].id}
      <Card cardId={$view.cards[0].id}>
        <CardContent>
          <Waveform
            current={$player.currentTime}
            duration={$player.duration}
            url={$player.track.waveform_url}
          />
          <div class="times">
            <div class="current">{formatTime($player.currentTime)}</div>
            <div class="duration">{formatTime($player.duration)}</div>
          </div>
          <Typography type="title" align="center">{$player.track.title}</Typography>
          <Typography type="titleSmall" align="center"
            >{$player.track.user.full_name || $player.track.user.username}</Typography
          >
        </CardContent>
      </Card>
    {/if}
  </ViewContent>
</View>

<style>
  .times {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: var(--accent-color);
  }
</style>

<script lang="ts">
  import KaiOS from 'kaios-lib';
  import numeral from 'numeral';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Priority, RenderState } from 'onyx-ui/enums';
  import { KeyManager } from 'onyx-ui/services';
  import { appMenu } from 'onyx-ui/stores';
  import { registerView, view } from 'onyx-ui/stores/view';
  import { onDestroy } from 'svelte';
  import MdComment from 'svelte-icons/md/MdComment.svelte';
  import MdFavorite from 'svelte-icons/md/MdFavorite.svelte';
  import MdPlayArrow from 'svelte-icons/md/MdPlayArrow.svelte';
  import MdRepeat from 'svelte-icons/md/MdRepeat.svelte';
  import { replace } from 'svelte-spa-router';
  import { pause, play, previousTrack, skip, skipTo } from '../components/AudioPlayer.svelte';
  import Waveform from '../components/Waveform.svelte';
  import { player } from '../stores/player';
  import { formatTime } from '../utils/formatTime';
  import { getImage } from '../utils/getImage';

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
        if ($player.currentTime < 10) {
          previousTrack();
        } else {
          skipTo(0);
        }
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
    if ($player.track && $appMenu.state === RenderState.Destroyed) keyMan.enable();
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
      <div class="player" style="background-image: url({getImage($player.track.artwork_url, 500)})">
        <div class="title-contaner"><div class="title">{$player.track.title}</div></div>
        <div class="artist-contaner"><div class="artist">{$player.track.user.username}</div></div>
        <div class="spacer" />
        <Waveform
          current={$player.currentTime}
          duration={$player.duration}
          url={$player.track.waveform_url}
        />
        <div class="times">
          <div class="current">{formatTime($player.currentTime)}</div>
          <div class="duration">{formatTime($player.duration)}</div>
        </div>
      </div>
      <div class="stats">
        <div class="item">
          <Icon><MdPlayArrow /></Icon>{numeral($player.track.playback_count).format('0.0a')}
        </div>
        <div class="item">
          <Icon><MdFavorite /></Icon>{numeral($player.track.favoritings_count).format('0.0a')}
        </div>
        <div class="item">
          <Icon><MdRepeat /></Icon>{numeral($player.track.reposts_count).format('0a')}
        </div>
        <div class="item">
          <Icon><MdComment /></Icon>{numeral($player.track.comment_count).format('0a')}
        </div>
      </div>
    {/if}
  </ViewContent>
</View>

<style>
  .player {
    display: flex;
    flex-direction: column;
    justify-content: end;
    height: 100%;
    position: relative;
    background-position: center top;
    background-size: cover;
  }
  .spacer {
    flex: 1;
  }
  .title-contaner {
    padding: 10px;
  }
  .artist-contaner {
    padding: 0 10px;
  }
  .title,
  .artist {
    display: inline;
    background-color: black;
    box-shadow: 5px 0 0 #000, -5px 0 0 #000;
    padding: 5px 0;
    line-height: 1.5;
    color: white;
    margin-bottom: 15px;
    font-weight: 600;
  }
  .title {
    font-size: 1.6rem;
  }
  .artist {
    font-size: 1.4rem;
  }

  .spacer {
    flex: 1;
  }

  .times {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    color: var(--accent-color);
    padding: 0 5px;
    display: none;
  }

  .stats {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    display: none;
  }
  .stats > .item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

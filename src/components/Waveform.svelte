<script lang="ts">
  import { SoundCloud } from '../lib/soundcloud';

  export let current: number;
  export let duration: number;
  export let url: string;
  export let barWidth: number = 3;
  export let spacerWidth: number = 1;

  const barCount = window.innerWidth / (barWidth + spacerWidth);
  const secondsPerBar = duration / barCount;

  let getData: Promise<number[]> = new SoundCloud().track.getWaveformData(url).then((res) => {
    let samples = [...res.samples];

    const condensed = [];
    while (samples.length > 0) {
      const group = samples.splice(0, Math.ceil(res.samples.length / barCount));
      const average =
        group.reduce((acc, val) => {
          acc += val;
          return acc;
        }, 0) / group.length;

      condensed.push(average * 0.66666);
    }

    return condensed;
  });
</script>

<div class="root">
  {#await getData then data}
    {#each data as sample, i}
      <div
        class="sample"
        class:highlight={i * secondsPerBar < current}
        style="height: {sample}px; width: {barWidth}px; min-width: {barWidth}px; margin-right: {spacerWidth}px;"
      />
    {/each}
  {/await}
</div>

<style>
  .root {
    height: 114px;
    padding-top: 40px;
    overflow: hidden;
    display: flex;
    align-items: baseline;
    justify-content: center;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.8085828081232493) 53%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .sample {
    background-color: #bec0c6;
  }
  .sample:last-child {
    margin-right: 0px;
  }
  .sample.highlight {
    background-color: var(--accent-color);
  }
</style>

<script lang="ts">
  export let current: number;
  export let duration: number;
  export let url: string;

  let waveformHeight;
</script>

<div class="root" style="height: {Math.floor(waveformHeight - 5)}px">
  <div class="progress" style="right: {`${100 - (current / duration) * 100}%`}" />
  <div class="image" bind:clientHeight={waveformHeight}>
    <img src={url.replace('m.png', 's.png')} alt="" />
  </div>
</div>

<style>
  .root {
    position: relative;
    background-color: var(--tertiary-text-color);
    margin: 5px 0;
    overflow: hidden;
  }

  .root > .progress {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 100%;
    background-color: var(--accent-color);
    z-index: 1;
    transition: right 1000ms;
  }
  .root > .image {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 2;
    width: 100%;
    transition: transform 1000ms;
  }
  .root > .image > img {
    width: 100%;
    filter: brightness(10);
  }
</style>

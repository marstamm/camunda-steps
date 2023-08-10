<script>
  import { stage as stageStore } from './stores';

  let stage;

  stageStore.subscribe((value) => {
    stage = value;
  });
</script>

<header>
  {#if stage === 'dashboard'}
    <img src="header-left-dash.png" on:click={() => stageStore.set('build')} />
  {:else}
    <img src="header-left-build.png" />
  {/if}

  <img class="right" src="header-right.png" />
</header>

<style>
  .right {
    float: right;
  }

  header {
    background-color: rgb(244, 244, 244);
    height: 48px;
    border-bottom: 1px solid rgb(198, 198, 198);
  }
</style>

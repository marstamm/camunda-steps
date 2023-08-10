<script>
  import AddStep from './AddStep/AddStep.svelte';
  import ComponentList from './ComponentList.svelte';
  import Dashboad from './Dashboad.svelte';
  import Export from './Export.svelte';
  import FullScreenModeler from './FullScreenModeler.svelte';
  import Header from './Header.svelte';
  import Preview from './Preview.svelte';
  import { ejected, stage as stageStore } from './stores';

  let stage = 'dashboard';
  stageStore.subscribe((value) => {
    stage = value;
  });

  ejected.subscribe((value) => {
    if (value) {
      stageStore.set('ejected');
    }
    // stageStore.set('ejected');
  });
</script>

<!-- <div class="ui segment"> -->
{#if stage === 'dashboard'}
  <Header />
  <Dashboad />
{/if}
{#if stage === 'build'}
  <Header />
  <div class="main ui two column grid">
    <div class="ui four wide column left">
      <ComponentList />
    </div>
    <div class="ui twelve wide column right" style="overflow: auto;">
      <Preview />
    </div>
  </div>
{/if}

{#if stage === 'ejected'}
  <FullScreenModeler />
{/if}

<!-- </div> -->

<style>
  .main {
    width: 100vw;
    height: calc(100vh - 48px);
  }

  .main .column {
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
    /* overflow: auto; */
  }
  .left {
    padding-right: 0 !important;
  }

  .right {
    padding-left: 2px !important;
  }
</style>

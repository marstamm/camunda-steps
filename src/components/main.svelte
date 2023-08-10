<script>
  import AddStep from './AddStep/AddStep.svelte';
  import ComponentList from './ComponentList.svelte';
  import Export from './Export.svelte';
  import FullScreenModeler from './FullScreenModeler.svelte';
  import Preview from './Preview.svelte';
  import { ejected } from './stores';

  let fullScreen = false;

  ejected.subscribe((value) => {
    fullScreen = value;
  });
</script>

<!-- <div class="ui segment"> -->
{#if fullScreen}
  <FullScreenModeler />
{:else}
  <div class="main ui two column grid">
    <div class="ui four wide column">
      <ComponentList />
    </div>
    <div class="ui twelve wide column" style="overflow: auto;">
      <Preview />
    </div>
  </div>
{/if}

<!-- </div> -->

<style>
  .main {
    width: 100vw;
    height: 100%;
  }

  .main .column {
    height: 100%;
    /* overflow: auto; */
  }
</style>

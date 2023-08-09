<script>
  import AddStep from './AddStep/AddStep.svelte';
  import ComponentList from './ComponentList.svelte';
  import Export from './Export.svelte';
  import Preview from './Preview.svelte';
</script>

<!-- <div class="ui segment"> -->
<div class="main ui two column grid">
  <div class="ui six wide column">
    <ComponentList />
  </div>
  <div class="ui ten wide column" style="overflow: auto;">
    <Preview />
  </div>
</div>

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

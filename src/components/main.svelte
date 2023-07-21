<script>
  import AddStep from './AddStep.svelte';
  import ComponentList from './ComponentList.svelte';
  import Export from './Export.svelte';
  import Preview from './Preview.svelte';
</script>

<!-- <div class="ui segment"> -->
<div class="ui divided grid" style="height: 100vh;">
  <div class="ui four wide column">
    <ComponentList />
    <AddStep />
  </div>
  <div class="ui twelve wide column">
    <Preview />
    <Export />
  </div>
</div>
<!-- </div> -->

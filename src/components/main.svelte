<script>
  import AddStep from './AddStep/AddStep.svelte';
  import ComponentList from './ComponentList.svelte';
  import Export from './Export.svelte';
  import Preview from './Preview.svelte';
</script>

<!-- <div class="ui segment"> -->
<div class="ui two column grid" style="height: 100vh;">
  <div class="ui six wide column">
    <ComponentList />
  </div>
  <div class="ui ten wide column">
    <Preview />
    <Export />
  </div>
</div>
<!-- </div> -->

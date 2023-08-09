<script>
  import Modal from './Modal.svelte';
  import { templates, stepList } from '../stores';
  import SearchableList from './SearchableList.svelte';

  let select;

  let showModal = false;

  const handleAddStep = (template) => {
    const item = { id: crypto.randomUUID(), template, name: template.name };
    stepList.add(item);
    showModal = false;
  };
</script>

<!-- <select bind:this={select}>

</select> -->

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="step" on:click={() => (showModal = true)}>
  <i class="icon">
    <i class="plus icon" />
  </i>
  <div class="content">
    <div class="title">Add Step</div>
    <div class="description">Add a new step to the workflow</div>
  </div>
</div>
<!-- <button on:click={handleAddStep}>Add Step</button> -->

<Modal bind:showModal>
  <SearchableList {templates} onSelect={handleAddStep} />
</Modal>

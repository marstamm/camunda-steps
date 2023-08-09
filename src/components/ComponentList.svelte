<script>
  import AddStep from './AddStep/AddStep.svelte';
  import Export from './Export.svelte';
  import Step from './Step.svelte';
  import { stepList, selected, templates } from './stores';
  import { flip } from 'svelte/animate';

  let steps = [];
  let localSelected;

  stepList.subscribe((value) => {
    steps = value;
  });

  const handleSelect = (step) => {
    selected.update(() => step);
  };

  selected.subscribe((value) => {
    localSelected = value;
  });

  const handleDragstart = (event, i) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  };

  const handleDrop = (event, target) => {
    event.dataTransfer.dropEffect = 'move';
    const start = parseInt(event.dataTransfer.getData('text/plain'));
    const newTracklist = steps;

    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }

    stepList.set(newTracklist);
    hovering = null;
  };

  let hovering;
</script>

<div class="ComponentList ui fluid vertical steps">
  <div class="step">
    <i class="icon">
      <i class="play icon" />
    </i>
    <div class="content">
      <div class="title">Process Start</div>
      <div class="description">Click to modify start trigger</div>
    </div>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  {#each steps as step, i (step.id)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
      class="step"
      animate:flip={{ duration: 500 }}
      class:active={step === localSelected}
      on:click={handleSelect(step)}
      draggable="true"
      on:dragstart={(e) => handleDragstart(e, i)}
      on:drop|preventDefault={(e) => handleDrop(e, i)}
      ondragover="return false"
      on:dragenter={() => (hovering = i)}
      class:is-active={hovering === i}
    >
      <Step {step} />
    </div>
  {/each}
  <div class="ui buttons">
    <AddStep />
    <Export />
  </div>
</div>

<style>
  .step.is-active {
    background-color: #aaa !important;
  }

  :global(.ComponentList) {
    --background-color: white;
  }

  .step {
    background-color: var(--background-color);
  }
</style>

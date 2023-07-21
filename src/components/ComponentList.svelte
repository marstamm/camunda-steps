<script>
  import { stepList, selected, templates } from './stores';
  import { flip } from 'svelte/animate';

  let steps = [];
  let localSelected;

  stepList.subscribe((value) => {
    steps = value;
  });

  const handleSelect = (step) => {
    console.log(step);
    selected.update(() => step);
  };

  selected.subscribe((value) => {
    localSelected = value;
  });

  const handleDragstart = (event, i) => {
    console.log(event, i);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.dropEffect = 'move';
    const start = i;
    event.dataTransfer.setData('text/plain', start);
  };

  const handleDrop = (event, target) => {
    event.dataTransfer.dropEffect = 'move';
    const start = parseInt(event.dataTransfer.getData('text/plain'));
    const newTracklist = steps;

    console.log(newTracklist[start], start, target, event.dataTransfer.getData('text/plain'));

    if (start < target) {
      newTracklist.splice(target + 1, 0, newTracklist[start]);
      newTracklist.splice(start, 1);
    } else {
      newTracklist.splice(target, 0, newTracklist[start]);
      newTracklist.splice(start + 1, 1);
    }

    stepList.set(newTracklist);
    hovering = null;
    // list = newTracklist;
  };

  let hovering;

  console.log(hovering);
</script>

<!-- <ul>
  <li>
    <button on:click={handleSelect(step)}> {step.name} </button>
  </li>
</ul> -->

<div class="ui vertical steps">
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
      <i class="icon">
        {#if step.template.icon}
          <img style="height: 1em;" src={step.template.icon.contents} alt="icon" />
        {:else}
          <i class="question circle outline icon" />
        {/if}
      </i>
      <div class="content">
        <div class="title">{step.name}</div>
        <div class="description">{step.template.description}</div>
      </div>
    </div>
  {/each}
</div>

<!-- <div class="completed step">
    <i class="truck icon"></i>
    <div class="content">
      <div class="title">Shipping</div>
      <div class="description">Choose your shipping options</div>
    </div>
  </div>
  <div class="completed step">
    <i class="credit card icon"></i>
    <div class="content">
      <div class="title">Billing</div>
      <div class="description">Enter billing information</div>
    </div>
  </div>
  <div class="active step">
    <i class="info icon"></i>
    <div class="content">
      <div class="title">Confirm Order</div>
      <div class="description">Verify order details</div>
    </div>
  </div>
</div> -->

<style>
  .step.is-active {
    background-color: #aaa;
    /* color: #fff; */
  }
</style>

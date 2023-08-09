<script>
  import ContentEditable from './reusables/ContentEditable.svelte';

  export let step;
</script>

<i class="icon">
  {#if step.template.icon}
    <img style="height: 1em;" src={step.template.icon.contents} alt="icon" />
  {:else}
    <i class="question circle outline icon" />
  {/if}
</i>
<div class="content">
  <ContentEditable class="title" onEdited={(name) => (step.name = name)}>
    {step.name}
  </ContentEditable>
  <ContentEditable class="description" onEdited={(description) => (step.description = description)}>
    {step.description || step.template.description}
  </ContentEditable>
</div>

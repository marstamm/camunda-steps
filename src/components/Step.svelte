<script>
  import ContentEditable from './reusables/ContentEditable.svelte';
  import { stepList, selected, templates, modeler as modelerStore } from './stores';

  export let step;

  let modeler;
  modelerStore.subscribe((value) => {
    modeler = value;
  });

  const addToCanvas = (element) => {
    const canvas = modeler.get('canvas');
    Object.assign(element, { x: 0, y: 0, width: 100, height: 100 });
    canvas.addShape(element);
  };

  const remove = () => {
    stepList.remove(step);
  };

  const toggleOptional = (e) => {
    const modeling = modeler.get('modeling');
    const elementFactory = modeler.get('elementFactory');
    if (!step.optional) {
      step.optional = true;
      const diverging = elementFactory.createShape({ type: 'bpmn:ExclusiveGateway' });
      const converging = elementFactory.createShape({ type: 'bpmn:ExclusiveGateway' });
      addToCanvas(diverging);
      addToCanvas(converging);
      const defaultFlow = modeling.connect(diverging, converging);
      const condition = modeling.connect(diverging, step.elements.in);
      modeling.connect(step.elements.out, converging);
      modeling.updateProperties(diverging, { default: defaultFlow });
      step.elements.in = diverging;
      step.elements.out = converging;
      step.elements.condition = condition;
    } else {
      // Just don't do it
      step.optional = false;
    }
  };

  const openCondtion = (e) => {
    const selection = modeler.get('selection');
    selection.select(step.elements.condition);
    e.stopPropagation();
  };
</script>

{#if step.optional}
  <div
    style="float: left;
  margin-left: -20px;
  width: 20px;"
    on:click={openCondtion}
  >
    <i class="question circle icon" alt="Step is optional" />
  </div>
{/if}
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
  <div class="edit float right">
    <button class="ui simple dropdown item left">
      <i class="icon wrench" />
      <div class="menu">
        <div class="item">Create Parallel Group</div>
        <div class="item" on:click={toggleOptional}>Make Optional</div>
        <div class="item">Make non-blocking</div>
        <div class="item" on:click={remove}>Delete step</div>
      </div>
    </button>
  </div>
</div>

<style>
  .float.right {
    position: absolute;
    right: 5px;
    top: 5px;
    float: right;
  }
  .content {
    width: 80%;
  }

  :global(.active .edit) {
    display: inline !important;
  }

  .edit {
    display: none;
  }
</style>

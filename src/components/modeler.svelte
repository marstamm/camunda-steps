<script>
  import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';

  import defaultDiagram from '../util/defaultDiagram';
  import { onMount } from 'svelte';
  import { templates, stepList, selected, modeler as modelerStore } from './stores';

  let modelerContainer, propertiesContainer;
  let modeler;

  onMount(async () => {
    const { default: BpmnModeler } = await import(
      'camunda-bpmn-js/dist/camunda-cloud-modeler.development.js'
    );

    modeler = new BpmnModeler({
      container: modelerContainer,
      keyboard: {
        bindTo: document
      },
      propertiesPanel: {
        parent: propertiesContainer
      },
      elementTemplates: templates
    });

    modelerStore.set(modeler);

    modeler.importXML(defaultDiagram);
  });

  stepList.subscribeToChanges((action, step) => {
    const canvas = modeler.get('canvas');

    if (action === 'add') {
      const element = modeler.get('elementTemplates').createElement(step.template);
      step.elements = {
        all: [element],
        main: element,
        in: element,
        out: element
      };
      step.id = element.id;
      Object.assign(element, { x: 0, y: 0, width: 100, height: 100 });
      canvas.addShape(element);
    }

    if (action === 'remove') {
      const element = modeler.get('elementRegistry').get(step.id);
      canvas.removeShape(element);
    }
  });

  let selectedElement;

  selected.subscribe((step) => {
    if (!modeler) {
      return;
    }
    const element = modeler.get('elementRegistry').get(step.id);

    selectedElement = element;
    console.log(selected);
    modeler.get('selection').select(element);
  });
</script>

<!-- <div class="placeholder" class:hidden={!!selectedElement}>
  <h2 class="center ui centered icon header">
    <i class="settings icon" />
    <div class="content">
      Nothing to show
      <div class="sub header">Select or add steps to the workflow</div>
    </div>
  </h2>
</div> -->
<div bind:this={modelerContainer} class="modeler-container hidden" />
<div bind:this={propertiesContainer} class:hidden={!selectedElement} />

<style>
  :global(.bio-properties-panel-group[data-group-id='group-ElementTemplates__Template']) {
    display: none !important;
  }

  :global(.bio-properties-panel-group[data-group-id='group-general']) {
    display: none !important;
  }

  .modeler-container {
    /* display: none; */
  }

  .hidden {
    display: none !important;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    margin-left: auto;
    margin-right: auto;
  }

  .center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :global(.bio-properties-panel-header) {
    background-color: white;
  }
</style>

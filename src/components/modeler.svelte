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
    if (action === 'add') {
      const element = modeler.get('elementTemplates').createElement(step.template);
      step.id = element.id;
      const canvas = modeler.get('canvas');
      Object.assign(element, { x: 0, y: 0, width: 100, height: 100 });
      canvas.addShape(element);
    }
  });

  selected.subscribe((step) => {
    if (!modeler) {
      return;
    }
    const element = modeler.get('elementRegistry').get(step.id);
    modeler.get('selection').select(element);
  });
</script>

<div bind:this={modelerContainer} style="display: none;" />
<div bind:this={propertiesContainer} />

<style>
  :global(.bio-properties-panel-group[data-group-id='group-ElementTemplates__Template']) {
    display: none !important;
  }

  :global(.bio-properties-panel-group[data-group-id='group-general']) {
    display: none !important;
  }
</style>

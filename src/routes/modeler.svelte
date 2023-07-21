<script>
  import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';

  import { onMount } from 'svelte';

  let modelerContainer, propertiesContainer;

  onMount(async () => {
    const { default: BpmnModeler } = await import(
      'camunda-bpmn-js/dist/camunda-cloud-modeler.development.js'
    );

    const modeler = new BpmnModeler({
      container: modelerContainer,
      keyboard: {
        bindTo: document
      },
      propertiesPanel: {
        parent: propertiesContainer
      }
    });

    modeler.import;
  });
</script>

<div bind:this={modelerContainer} />
<div bind:this={propertiesContainer} />

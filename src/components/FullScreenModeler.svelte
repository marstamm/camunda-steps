<script>
  import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css';

  // import defaultDiagram from '../util/defaultDiagram';
  import { onMount } from 'svelte';
  import { templates, stepList, selected, modeler as modelerStore, ejectedXML } from './stores';

  let modelerContainer, propertiesContainer;
  let modeler;

  let diagramXML;

  ejectedXML.subscribe((exml) => {
    diagramXML = exml;
  });

  onMount(async () => {
    const { default: BpmnModeler } = await import(
      'camunda-bpmn-js/dist/camunda-cloud-modeler.development.js'
    );

    modeler = new BpmnModeler({
      container: modelerContainer,
      keyboard: {
        bindTo: modelerContainer
      },
      propertiesPanel: {
        parent: propertiesContainer
      },
      elementTemplates: templates
    });

    modeler.importXML(diagramXML);
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
<div class="FullScreeenModeler">
  <div bind:this={modelerContainer} class="modeler-container" />
  <div bind:this={propertiesContainer} class="properties-panel-container" />
</div>

<style>
  .FullScreeenModeler {
    display: flex;
    height: 100vh;
  }
  .properties-panel-container {
    background: #f8f8f8;
    border-left: solid 1px #ccc;
    width: 300px;
  }

  .modeler-container {
    /* display: none; */
    flex-grow: 1;
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
</style>

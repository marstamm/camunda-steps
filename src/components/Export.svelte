<script>
  import { layoutProcess } from 'bpmn-auto-layout';

  import {
    stepList as stepListStore,
    modeler as modelerStore,
    ejected,
    ejectedXML
  } from './stores';
  import Modal from './AddStep/Modal.svelte';

  let stepList, modeler;

  stepListStore.subscribe((value) => {
    stepList = value;
  });

  modelerStore.subscribe((value) => {
    modeler = value;
  });

  const handleEject = async () => {
    showModal = false;
    const modeling = modeler.get('modeling');
    const elementFactory = modeler.get('elementFactory');
    const canvas = modeler.get('canvas');

    const elements = stepList.map((step) => {
      const element = modeler.get('elementRegistry').get(step.id);
      modeling.updateLabel(element, step.name);
      return [step.elements.in, step.elements.out];
    });

    if (!isStartEvent[0]) {
      const startEvent = elementFactory.createShape({ type: 'bpmn:StartEvent' });
      Object.assign(startEvent, { x: 0, y: 0, width: 100, height: 100 });
      canvas.addShape(startEvent);
      elements.unshift([startEvent, startEvent]);
    }

    const endEvent = elementFactory.createShape({ type: 'bpmn:EndEvent' });
    Object.assign(endEvent, { x: 0, y: 0, width: 100, height: 100 });
    canvas.addShape(endEvent);
    elements.push([endEvent, endEvent]);

    console.log(elements);

    const connections = [];
    console.log(elements);
    for (let i = 0; i < elements.length - 1; i++) {
      console.log(elements[i], elements[i + 1]);
      const element = elements[i][1];
      const nextElement = elements[i + 1][0];
      connections.push(modeling.connect(element, nextElement));
    }

    const { xml } = await modeler.saveXML({ format: true });
    console.log(xml);
    const layoutedDiagramXML = await layoutProcess(xml);
    modeler.importXML(layoutedDiagramXML);
    console.log(layoutedDiagramXML);
    // stepListStore.set(steps);
    ejectedXML.set(layoutedDiagramXML);
    ejected.set(true);
  };

  function isStartEvent(element) {
    return is(element, 'bpmn:StartEvent');
  }

  let showModal;
  const confirmEject = () => {
    showModal = true;
    console.log('showModal');
    // handleEject()
  };
</script>

<button class="ui labeled icon button" on:click={confirmEject}>
  <i class="cloud upload icon" />
  Deploy
</button>

<Modal bind:showModal>
  <div class="ui negative message">
    <div class="header">This action cannot be undone</div>
    <p>
      Ejecting this Workflow will generate a BPMN file. You not be able to return to the list view.
    </p>
  </div>
  <div class="ui buttons" slot="buttons">
    <button class="ui button" on:click={() => (showModal = false)}>Cancel</button>
    <button class="ui negative button" on:click={handleEject}>Eject</button>
  </div>
</Modal>

<!-- <button class="foo bar" on:click={handleEject}>Eject</button> -->

<style>
  /* .foo {
    background-color: red;
  } */
</style>

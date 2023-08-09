<script>
  import { layoutProcess } from 'bpmn-auto-layout';

  import { stepList as stepListStore, modeler as modelerStore } from './stores';

  let stepList, modeler;

  stepListStore.subscribe((value) => {
    stepList = value;
  });

  modelerStore.subscribe((value) => {
    modeler = value;
  });

  const handleEject = async () => {
    const modeling = modeler.get('modeling');
    const elementFactory = modeler.get('elementFactory');
    const canvas = modeler.get('canvas');

    const elements = stepList.map((step) => {
      const element = modeler.get('elementRegistry').get(step.id);
      modeling.updateLabel(element, step.name);
      return element;
    });

    if (!isStartEvent[0]) {
      const startEvent = elementFactory.createShape({ type: 'bpmn:StartEvent' });
      Object.assign(startEvent, { x: 0, y: 0, width: 100, height: 100 });
      canvas.addShape(startEvent);
      elements.unshift(startEvent);
    }

    const endEvent = elementFactory.createShape({ type: 'bpmn:EndEvent' });
    Object.assign(endEvent, { x: 0, y: 0, width: 100, height: 100 });
    canvas.addShape(endEvent);
    elements.push(endEvent);

    console.log(elements);

    const connections = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const nextElement = elements[i + 1];
      connections.push(modeling.connect(element, nextElement));
    }

    const { xml } = await modeler.saveXML();

    const layoutedDiagramXML = await layoutProcess(xml);
    modeler.importXML(layoutedDiagramXML);
    // stepListStore.set(steps);
  };

  function isStartEvent(element) {
    return is(element, 'bpmn:StartEvent');
  }
</script>

<button class="ui labeled icon button" on:click={handleEject}>
  <i class="cloud upload icon" />
  Deploy
</button>

<!-- <button class="foo bar" on:click={handleEject}>Eject</button> -->

<style>
  /* .foo {
    background-color: red;
  } */
</style>

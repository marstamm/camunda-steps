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

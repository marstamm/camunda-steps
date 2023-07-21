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

    const elements = stepList.map((step) => {
      return modeler.get('elementRegistry').get(step.id);
    });

    if (isStartEvent[0]) {
      // Create non-start event
      console.log('isStartEvent');
    }

    const connections = [];
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const nextElement = elements[i + 1];
      connections.push(modeling.connect(element, nextElement));
    }

    const { xml } = await modeler.saveXML();
    console.log(xml);

    const layoutedDiagramXML = await layoutProcess(xml);
    console.log(layoutedDiagramXML);
    modeler.importXML(layoutedDiagramXML);
    // stepListStore.set(steps);
  };

  function isStartEvent(element) {
    return is(element, 'bpmn:StartEvent');
  }
</script>

<button class="foo bar" on:click={handleEject}>Eject</button>

<style>
  .foo {
    background-color: red;
  }
</style>

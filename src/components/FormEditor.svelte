<script>
  // import { FormEditor } from '@bpmn-io/form-js';
  import { onDestroy, onMount } from 'svelte';
  import { FormHelper } from './helpers/FormHelper.mjs';

  export let element;
  export let modeler;

  console.log(modeler);
  const injector = modeler.get('injector');
  const formHelper = injector.invoke(FormHelper);

  // formHelper.resetForm(element);
  // get the saved form
  const formBody = formHelper.getUserTaskForm(element)?.body;
  const parsedSchema = JSON.parse(formBody || null);

  const defaultForm = {
    type: 'default',
    id: 'Form_1jeuaid',
    components: [],
    executionPlatform: 'Camunda Cloud',
    executionPlatformVersion: '8.2.0'
  };

  let formContainer;
  let formEditor;
  const updateElementForm = (schema) => {
    console.log('updateElementForm');
    formHelper.setUserTaskForm(element, JSON.stringify(schema, null, 2));
  };

  onDestroy(() => {
    formEditor && formEditor.destroy();
  });

  onMount(async () => {
    const { FormEditor } = await import('@bpmn-io/form-js');

    formEditor = new FormEditor({
      container: formContainer
    });

    await formEditor.importSchema(parsedSchema || defaultForm);

    formEditor.on('changed', (event) => {
      const schema = formEditor.saveSchema();
      updateElementForm(schema);
    });
  });
</script>

<div bind:this={formContainer} class="form-container" />

<script>
  import { templates, stepList } from './stores';

  let select;

  const handleAddStep = () => {
    const value = select.value;
    const template = templates[value];
    const item = { id: crypto.randomUUID(), template, name: template.name };
    stepList.add(item);
  };
</script>

<select bind:this={select}>
  {#each templates as template, i}
    <option value={i}>{template.name}</option>
  {/each}
</select>

<button on:click={handleAddStep}>Add Step</button>

<script>
  export let templates;
  export let onSelect;

  const handleSelect = (template) => {
    onSelect(template);
  };

  let search = '';

  let filteredTemplates = templates;

  const updateFilter = (event) => {
    search = event.target.value.toLowerCase();
    if (!search) {
      filteredTemplates = templates;
      return;
    }

    filteredTemplates = templates.filter((template) => {
      return (
        template.name.toLowerCase().includes(search) ||
        template.description.toLowerCase().includes(search)
      );
    });
  };
</script>

<div class="ui input">
  <input autofocus type="text" placeholder="Search..." value={search} on:input={updateFilter} />
</div>

<div class="ui cards">
  {#each filteredTemplates as template, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="card" on:click={() => handleSelect(template)}>
      <div class="content">
        {#if template.icon}
          <img class="right floated mini ui image" src={template.icon.contents} alt="icon" />
        {:else}
          <i class="question circle outline icon" />
        {/if}

        <div class="header">{template.name}</div>
        <div class="meta">{template.description}</div>
      </div>
    </div>
  {/each}
</div>

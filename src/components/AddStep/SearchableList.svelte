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

<div class="modal-content">
  <div class="ui grid">
    <div class="sixteen wide column">
      <div class="ui input" style="width: 100%;">
        <input
          autofocus
          type="text"
          placeholder="Search..."
          value={search}
          on:input={updateFilter}
        />
      </div>
    </div>
    {#each filteredTemplates as template, i}
      <div class="ui sixteen wide column">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="ui segment" on:click={() => handleSelect(template)}>
          {#if template.icon}
            <img class="left floated mini ui image" src={template.icon.contents} alt="icon" />
          {:else}
            <i class="question circle outline icon" />
          {/if}
          <div class="content">
            <h4 class="ui header">{template.name}</h4>
            <div class="meta">{template.description}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .modal-content {
    width: 80vw;
    min-height: 80vh;
  }

  .mini.ui.image {
    margin-top: 0.5em;
  }
</style>

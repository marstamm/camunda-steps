<script>
  import { clickOutside } from './clickOutside.js';

  export let onEdited = () => {};
  let editing = false;

  const handleDblClick = (event) => {
    let div = event.target;
    editing = true;
    div.contentEditable = true;
  };

  const handleClickOutside = (event) => {
    if (!editing) return;
    editing = false;

    let div = event.target;
    div.contentEditable = false;
    onEdited(div.innerText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      editing = false;

      let div = event.target;
      div.contentEditable = false;
      onEdited(div.innerText);
      event.preventDefault();
    }
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={$$restProps.class || ''}
  on:dblclick={handleDblClick}
  on:keydown={handleKeyDown}
  use:clickOutside
  on:click_outside={handleClickOutside}
>
  <slot />
</div>

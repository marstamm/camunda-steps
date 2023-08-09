<script>
  import { clickOutside } from './clickOutside.js';

  export let onEdited;

  const handleDblClick = (event) => {
    let div = event.target;
    div.contentEditable = true;
  };

  const handleClickOutside = (event) => {
    let div = event.target;
    div.contentEditable = false;
    onEdited(div.innerText);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      let div = event.target;
      div.contentEditable = false;
      onEdited(div.innerText);
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

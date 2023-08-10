<script>
  import { stage } from './stores';
</script>

<h1 class="ui header">Dashboard</h1>

<div class="ui placeholder segment">
  <div class="ui icon header">
    <i class="folder open outline icon" />
    You have not created any workflows yet.
  </div>
  <div
    class="ui primary button"
    on:click={() => {
      stage.set('build');
    }}
  >
    Start Building
  </div>
</div>

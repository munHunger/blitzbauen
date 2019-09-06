<script>
  import History from "./History.svelte";
  import Steps from "./Steps.svelte";
  import Console from "./Console.svelte";
  let state = {};
</script>

<History onSelect={id => (state.id = id)} />
{#if state.id}
  <!-- <Steps jobId={state.id} onSelect={step => (state.step = step)} /> -->
{/if}
{#if state.step && state.id}
  <Console jobId={state.id} step={state.step} />
{/if}

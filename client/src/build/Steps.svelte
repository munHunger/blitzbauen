<script>
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, JOBDETAIL } from "../data";

  export let jobId;
  export let onSelect;

  $: steps = query(client, { query: JOBDETAIL, variables: { id: jobId } });
</script>

<style>
  .steps {
    position: relative;
    width: 200px;
    height: 100%;
    display: inline-block;
  }
</style>

<div class="steps mui-col-md-1">
  {#await $steps}
    Loading...
  {:then result}
    {#each result.data.history[0].details as step}
      <StatusItem
        title={step.step}
        subtitle={step.time}
        status={step.status}
        onClick={() => onSelect(step.step)} />
    {/each}
  {/await}
</div>

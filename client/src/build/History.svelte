<script>
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, HISTORY } from "../data";

  export let onSelect;

  const builds = query(client, { query: HISTORY });
</script>

<style>
  .builds {
    position: relative;
    width: 200px;
    height: 100%;
    display: inline-block;
  }
</style>

<div class="builds mui-col-md-1">
  {#await $builds}
    Loading...
  {:then result}
    {#each result.data.history as job}
      <StatusItem
        title={job.name}
        status={job.status}
        subtitle={job.timestamp}
        onClick={() => onSelect(job.id)} />
    {/each}
  {/await}
</div>

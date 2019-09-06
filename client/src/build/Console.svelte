<script>
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, STEP_OUTPUT } from "../data";

  export let jobId;
  export let step;

  $: output = client.request({
    query: STEP_OUTPUT,
    variables: { id: jobId, step: step }
  });
</script>

<style>
  .console {
    position: relative;
    padding: 10px;
    margin: 0px;
    display: inline-block;
    background-color: rgb(38, 39, 43);
    color: rgb(33, 214, 88);
    font-family: "Roboto Mono", monospace;
  }
</style>

<link
  href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap"
  rel="stylesheet" />
<div class="console">
  {#await $output}
    Loading...
  {:then result}
    {#if result}
      {#each result.data.history[0].details[0].output.split('\n') as paragraph}
        <div>{paragraph}</div>
      {/each}
    {/if}
  {/await}
</div>

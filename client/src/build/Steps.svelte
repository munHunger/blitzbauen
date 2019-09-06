<script>
  import Console from "./Console.svelte";
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, JOBDETAIL } from "../data";

  let stepName;
  export let jobId;
  export let onSelect;

  $: steps = client.request({ query: JOBDETAIL, variables: { id: jobId } });
</script>

<style>
  .output {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    margin: 0px;
    margin-bottom: 20px;
    display: inline-block;
    background-color: rgb(38, 39, 43);
    color: rgb(33, 214, 88);
    font-family: "Roboto Mono", monospace;
  }

  .text {
    font-family: "Roboto Mono", monospace;
    margin: 5px;
  }
</style>

{#await $steps}
  Loading...
{:then result}
  {#if result}
    {#each result.data.history[0].details as step}
      <div style="padding:0px">
        <div class="text">
          <span class="mui--text-light">{step.step}</span>
          <span class="mui--text-light-secondary" style="float:right">
            {step.time}
          </span>
        </div>
        <div class="output">
          {#each step.output.split('\n') as paragraph}
            <div>{paragraph}</div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
{/await}

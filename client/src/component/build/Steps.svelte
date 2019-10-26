<script>
  import Test from "./output/Test.svelte";
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, JOBDETAIL } from "../../data";

  let stepName;
  export let jobId;
  export let onSelect;
  export let details;

  if (!details)
    client
      .request({ query: JOBDETAIL, variables: { id: jobId } })
      .subscribe(data => (details = data.history[0].details));
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

{#if !details}
  Loading...
{:else}
  {#each details as step}
    {#if !step}
      Step is somehow null :(
    {:else}
      <div style="padding:0px">
        <div class="text">
          <span class="mui--text-light">{step.step}</span>
          {#each step.test || [] as test}
            <Test {test} />
          {/each}
          <span class="mui--text-light-secondary" style="float:right">
            {step.time}
          </span>
        </div>
        <div class="output">
          {#if step.output}
            {#each step.output.split('\n') as paragraph}
              <div>{paragraph}</div>
            {/each}
          {/if}
        </div>
      </div>
    {/if}
  {/each}
{/if}

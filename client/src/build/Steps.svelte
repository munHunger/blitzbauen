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
  .steps {
    position: relative;
    display: flex;
    background-color: rgb(245, 245, 245);
  }
  .console {
    background-color: rgb(45, 47, 49);
  }
</style>

{#await $steps}
  Loading...
{:then result}
  {#if result}
    {#each result.data.history[0].details as step}
      <div class="steps mui-col-md-12">
        <div class="mui-col-md-4">
          <StatusItem
            title={step.step}
            subtitle={step.time}
            status={step.status}
            onClick={() => {
              stepName = step.step;
              if (onSelect) onSelect(step.step);
            }} />
        </div>
        <div class="mui-col-md-6 console" style="padding:0px">
          {#if stepName && stepName === step.step}
            <Console {jobId} step={stepName} />
          {/if}
        </div>
      </div>
    {/each}
  {/if}
{/await}

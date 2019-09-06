<script>
  import Steps from "./Steps.svelte";

  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, HISTORY } from "../data";

  let id;
  export let onSelect;

  const builds = client.request({ query: HISTORY });
</script>

<style>
  .build {
    position: relative;
    height: 100%;
    display: flex;
    background-color: rgb(250, 250, 250);
  }

  .steps {
    background-color: rgb(45, 47, 49);
  }
</style>

{#await $builds}
  Loading...
{:then result}
  {#if result}
    {#each result.data.history as job}
      <div class="mui-container-fluid" style="padding: 0px">
        <div class="mui-row" style="padding: 0px">
          <div class="build mui-col-md-12" style="padding: 0px">
            <div class="mui-col-md-3" style="padding: 0px">
              <StatusItem
                title={job.name}
                status={job.status}
                subtitle={job.timestamp}
                onClick={() => {
                  id = job.id;
                  if (onSelect) onSelect(job.id);
                }} />
            </div>
            <div class="steps mui-col-md-9" style="padding:0px">
              {#if id && id === job.id}
                <Steps jobId={id} />
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
{/await}

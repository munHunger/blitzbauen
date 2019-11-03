<script>
  import Test from "./output/Test.svelte";
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import { client, JOBDETAIL } from "../../data";

  let stepName;
  export let jobId;
  export let onSelect;
  export let details;

  if (!(details || {}).details)
    client
      .request({ query: JOBDETAIL, variables: { id: jobId } })
      .subscribe(data => {
        details = data.data.history[0];
      });

  const getTestCount = step =>
    step.test.map(suite => suite.tests).reduce((acc, val) => acc + val, 0);
  const getFailureCount = step =>
    step.test.map(suite => suite.failures).reduce((acc, val) => acc + val, 0);
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
  .step {
    background-color: rgb(45, 47, 49);
  }

  .pretty {
    font-family: "Roboto Mono", monospace;
    font-size: 16px;
    padding-left: 40px;
  }

  .pretty .detail {
    color: rgba(0, 0, 0, 0.7);
    font-size: 13px;
  }
</style>

{#if !details}
  Loading...
{:else}
  {#if details.commit}
    <div class="mui-row">
      <div class="pretty mui-col-md-3">
        <div>{details.commit.message}</div>
        <div class="detail">
          <b>by</b>
          {details.commit.author}
        </div>
      </div>
      <div class="step mui-col-md-9" style="padding:0px" />
    </div>
  {/if}
  {#if details.details}
    {#each details.details as step}
      {#if !step}
        Step is somehow null :(
      {:else}
        <div class="mui-row">
          <div class="pretty mui-col-md-3">
            {#if step.test}
              {getTestCount(step) - getFailureCount(step)} out of {getTestCount(step)}
              tests passed
              <div>
                {#each step.test || [] as test}
                  <Test
                    {test}
                    successColor="rgba(0,0,0,0.1)"
                    failureColor="rgba(0,0,0,0.5)" />
                {/each}
              </div>
            {/if}
          </div>
          <div class="step mui-col-md-9" style="padding:0px">
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
        </div>
      {/if}
    {/each}
  {/if}
{/if}

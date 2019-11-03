<script>
  import Steps from "./Steps.svelte";
  import diff from "blitzdiff";
  import StatusItem from "./StatusItem.svelte";
  import { getClient, query } from "svelte-apollo";
  import {
    client,
    HISTORY,
    JOB_STARTED_SUBSCRIPTION,
    JOB_COMPLETED_SUBSCRIPTION,
    JOB_UPDATED_SUBSCRIPTION,
    JOBDETAIL,
    JOB_CHANGE_REQUEST
  } from "../../data";

  let id;
  export let onSelect;

  let builds = undefined;
  new Promise((resolve, _) =>
    client.request({ query: HISTORY }).subscribe(data => resolve(data))
  ).then(data => {
    builds = data.data.history;
    return data;
  });

  let latest;
  let diffs = [];
  client
    .request({
      query: JOB_STARTED_SUBSCRIPTION,
      variables: {}
    })
    .subscribe(data => {
      builds = builds; //trigger rerender
      client
        .request({
          query: JOB_UPDATED_SUBSCRIPTION,
          variables: {}
        })
        .subscribe(data => {
          let updatedJobId = data.data.onJobUpdated.id;
          let hash = (builds.find(b => b.id === updatedJobId) || {}).hash;
          client
            .request({
              query: JOB_CHANGE_REQUEST,
              variables: { id: updatedJobId, hash: hash }
            })
            .subscribe(data => {
              data = data.data.changeSet;
              if (data.change) data.change = JSON.parse(data.change);
              if (data.base)
                builds = [{ ...data.base, hash: data.hash }].concat(builds);
              else {
                let job = builds.find(job => job.id === updatedJobId);

                job = diff.join(job, data.change);
                job.hash = data.hash;
                builds = builds;
              }
            });
        });
    });

  client
    .request({
      query: JOB_COMPLETED_SUBSCRIPTION,
      variables: {}
    })
    .subscribe(data => {
      console.log("completed build");
      console.log(data);
      builds = builds; //trigger rerender
    });
</script>

<style>
  .build {
    position: relative;
    height: 100%;
    display: block;
    background-color: rgb(250, 250, 250);
  }
</style>

{#if !builds}
  Loading...
{:else}
  {#each builds as job}
    <div class="mui-container-fluid" style="padding: 0px; width:80%">
      <div class="mui-row" style="padding: 0px">
        <div class="build mui-col-md-12" style="padding: 0px">
          <div class="mui-col-md-3" style="padding: 0px">
            <StatusItem
              title={job.name}
              status={job.status}
              subtitle={job.timestamp}
              onClick={() => {
                if (id !== job.id) id = job.id;
                else id = undefined;
                if (onSelect) onSelect(job.id);
              }} />
          </div>
          <div class="mui-col-md-12" style="padding:0px">
            {#if id && id === job.id}
              <Steps jobId={id} details={job} />
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/each}
{/if}

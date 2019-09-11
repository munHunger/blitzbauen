<script>
  import { observe } from "svelte-observable";
  import { getClient, query } from "svelte-apollo";
  import {
    client,
    wsClient,
    SETTINGS_SUBSCRIPTION,
    SETTINGS,
    TRIGGER_BUILD,
    UPDATE_SETTINGS
  } from "../data";

  export let onSelect;

  let repo;

  const repositories = client
    .request({
      query: SETTINGS
    })
    .subscribe(res => (repo = res.data.settings));

  let addRepo = () => {
    console.log(repo);
    repo.repositories = repo.repositories.concat({ url: "" });
  };
  function triggerBuild(id) {
    client
      .request({ query: TRIGGER_BUILD, variables: { name: id } })
      .subscribe(_ => {});
  }

  wsClient
    .request({
      query: SETTINGS_SUBSCRIPTION,
      variables: {}
    })
    .subscribe(data => {
      repo = data.data.updatedSettings;
    });

  function onUpdate(event, parent, key) {
    parent[key] = event.srcElement.value || event.srcElement.innerHTML; //Manage both input and span DOM
    repo = repo;
    client
      .request({
        query: UPDATE_SETTINGS,
        variables: { settingsInput: repo }
      })
      .subscribe((data, error) => {
        console.log(data);
        if (error) console.error(error);
      });
  }
</script>

<style>
  .repo {
    display: flex;
  }
  .output {
    background-color: rgb(45, 47, 49);
    font-family: "Roboto Mono", monospace;
  }

  .json {
    background-color: rgb(38, 39, 43);
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
  }

  .field {
    color: rgb(46, 179, 240);
    margin-left: 15px;
  }

  .form {
    margin-top: 10px;
  }

  .value {
    color: rgb(255, 130, 72);
  }
</style>

{#if repo}
  {#each repo.repositories as repo}
    <div class="repo">
      <div class="mui-form--inline mui-col-md-4 form">
        <div class="mui-textfield">
          <input
            type="text"
            value={repo.name}
            on:keyup={event => onUpdate(event, repo, 'name')} />
          <label>Project name</label>
        </div>
        <div class="mui-textfield">
          <input
            type="text"
            value={repo.url}
            on:keyup={event => onUpdate(event, repo, 'url')} />
          <label>GIT URL</label>
        </div>
        <button
          class="mui-btn mui-btn--flat mui-btn--primary"
          on:click={() => triggerBuild(repo.name)}>
          refresh
        </button>
      </div>
      <div
        class="output mui--text-light-secondary mui-col-md-8"
        style="padding:0px;">
        <div class="json">
          &#10100;
          <br />
          <span class="field">"name"</span>
          :
          <span class="value">
            "
            <span
              contenteditable="true"
              on:keyup={event => onUpdate(event, repo, 'name')}>
              {repo.name}
            </span>
            "
          </span>
          <br />
          <span class="field">"url"</span>
          :
          <span class="value">
            "
            <span
              contenteditable="true"
              onkeyup=""
              on:keyup={event => onUpdate(event, repo, 'url')}>
              {repo.url}
            </span>
            "
          </span>
          <br />
          &#10101;
        </div>
      </div>
    </div>
  {/each}
{/if}

<button class="mui-btn mui-btn--primary" on:click={addRepo}>
  add repository
</button>

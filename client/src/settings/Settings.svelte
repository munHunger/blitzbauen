<script>
  import { observe } from "svelte-observable";
  import { getClient, query } from "svelte-apollo";
  import { client, SETTINGS } from "../data";

  export let onSelect;

  const repositories = client.request({
    query: SETTINGS
  });

  let addRepo = () => (repositories = repositories.concat({ url: "" }));
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

{#await $repositories}
  Loading settings
{:then result}
  {#if result}
    {#each result.data.settings.repositories as repo}
      <div class="repo">
        <div class="mui-form--inline mui-col-md-4 form">
          <div class="mui-textfield">
            <input type="text" value={repo.name} />
            <label>Project name</label>
          </div>
          <div class="mui-textfield">
            <input type="text" value={repo.url} />
            <label>GIT URL</label>
          </div>
          <button class="mui-btn mui-btn--flat mui-btn--primary">
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
              <span contenteditable="true" onkeyup="">{repo.name}</span>
              "
            </span>
            <br />
            <span class="field">"url"</span>
            :
            <span class="value">
              "
              <span contenteditable="true" onkeyup="">{repo.url}</span>
              "
            </span>
            <br />
            &#10101;
          </div>
        </div>
      </div>
    {/each}
  {/if}
{/await}

<button class="mui-btn mui-btn--primary" on:click={addRepo}>
  add repository
</button>

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
    margin: 20px 0px 20px 0px;
  }
</style>

{#await $repositories}
  Loading settings
{:then result}
  {#if result}
    {#each result.data.settings.repositories as repo}
      <div class="mui-form--inline repo">
        <div class="mui-textfield">
          <input type="text" value={repo.name} />
          <label>Project name</label>
        </div>
        <div class="mui-textfield">
          <input type="text" value={repo.url} />
          <label>GIT URL</label>
        </div>
        <button class="mui-btn mui-btn--flat mui-btn--primary">refresh</button>
      </div>
    {/each}
  {/if}
{/await}

<button class="mui-btn mui-btn--primary" on:click={addRepo}>
  add repository
</button>

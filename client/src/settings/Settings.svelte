<script>
  import { getClient, query } from "svelte-apollo";
  import { client, SETTINGS } from "../data";

  export let onSelect;

  const repositories = query(client, { query: SETTINGS });
  //let repositories = [{ url: "https://github.com/munhunger/blitzbauen.git" }];

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
{/await}

<button class="mui-btn mui-btn--primary" on:click={addRepo}>
  add repository
</button>

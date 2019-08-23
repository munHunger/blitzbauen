<script>
  let repositories = [{ url: "https://github.com/munhunger/blitzbauen.git" }];

  let addRepo = () => (repositories = repositories.concat({ url: "" }));
</script>

<style>
  .repo {
    margin: 20px 0px 20px 0px;
  }
</style>

{#each repositories as repo}
  <div class="mui-form--inline repo">
    <div class="mui-textfield">
      <input type="text" value={repo.url} />
      <label>GIT URL</label>
    </div>
    <button class="mui-btn mui-btn--flat mui-btn--primary">refresh</button>
  </div>
{/each}

<button class="mui-btn mui-btn--primary" on:click={addRepo}>
  add repository
</button>

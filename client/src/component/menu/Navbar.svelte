<script>
  import { router } from "@spaceavocado/svelte-router";

  let routeTo = url => $router.push(url);

  export const width = "5rem";
</script>

<style>
  .bar {
    position: fixed;
    height: 100%;
    background-color: #eee;
    text-align: center;
  }
  .bar > img {
    cursor: pointer;
    width: 80%;
    margin-top: 5px;
  }
</style>

<div class="bar" style="width:{width}">
  <img
    src="/fa/git-alt-brands.svg"
    alt="repositories"
    on:click={() => routeTo('/settings')} />
  <img
    src="/fa/cubes-solid.svg"
    alt="builds"
    on:click={() => routeTo('/build')} />
</div>

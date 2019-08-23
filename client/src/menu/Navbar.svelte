<script>
  import {router} from '@spaceavocado/svelte-router';

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
  <img src="/git.png" alt="repositories" on:click={() => routeTo("/settings")} />
  <img src="/cubes.png" alt="builds" on:click={() => routeTo("/build")} />
</div>

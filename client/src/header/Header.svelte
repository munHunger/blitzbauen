<script>
  import { router } from "@spaceavocado/svelte-router";
  import { addListener } from "../data";

  addListener(_ => {
    alerts += 1;
  });

  let alerts = 0;
</script>

<style>
  .bar {
    position: sticky;
    height: 40px;
    width: 100%;
    background-color: #dedede;
    text-align: center;
    top: 0px;
    left: 0px;
    z-index: 99;
  }
  .inbox {
    position: relative;
    float: right;
    margin-right: 20px;
  }
  .icon {
    cursor: pointer;
    width: 30px;
    margin-top: 5px;
  }
  .alert {
    position: absolute;
    width: 20px;
    height: 20px;
    box-shadow: 0px 3px 0px 0px rgba(148, 1, 1, 1);
    background-color: red;
    color: white;
    font-weight: 900;
    border-radius: 100%;
    right: -10px;
    top: 0px;
  }
  .blitz {
    float: left;
    margin-left: 15px;
    font-weight: 600;
    font-size: 30px;
    font-family: "Roboto Mono", monospace;
  }
</style>

<div class="bar">
  <div class="blitz">[Blitzbauen]$</div>
  <div class="inbox">
    <img src="/fa/inbox-solid.svg" alt="builds" class="icon" />
    {#if alerts > 0}
      <div class="alert">{alerts}</div>
    {/if}
  </div>
</div>

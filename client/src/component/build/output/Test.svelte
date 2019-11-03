<script>
  export let test;
  export let failureColor = "red";
  export let successColor = "rgb(33, 214, 88)";
</script>

<style>
  .test {
    position: relative;
    display: inline-block;
    margin: 1px;
    width: 5px;
    height: 10px;
    transition: all 0.25s ease-in-out;
  }
  .test:hover {
    transform: translateY(-2px);
    z-index: 9999;
  }
  .suite {
    display: inline;
    margin: 5px;
  }
  .info {
    position: absolute;
    top: 45px;
    left: 50%;
    background-color: rgba(9, 17, 17);
    transition: all 0.25s ease-in-out;
    transform: translateX(-50%);
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.75);
    padding: 10px;
    border-radius: 5px;
    color: antiquewhite;
    min-width: 150px;
    text-align: center;
  }
  .info::before {
    background-color: rgba(9, 17, 17);
    content: " ";
    width: 20px;
    height: 20px;
    position: absolute;
    transform: translateX(-50%) rotate(45deg);
    top: -10px;
    left: 50%;
  }
</style>

<div class="suite">
  {#each test.suite as testcase}
    <div
      class="test"
      style="background-color: {testcase.failure ? failureColor : successColor}"
      on:mouseenter={() => (testcase.mouseover = true)}
      on:mouseleave={() => (testcase.mouseover = false)}>
      <div class="info" style="opacity: {testcase.mouseover ? '1' : '0'}">
        <div class="name">{testcase.class}:{testcase.name}</div>
        {#if testcase.failure}
          <div class="error">{testcase.failure}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

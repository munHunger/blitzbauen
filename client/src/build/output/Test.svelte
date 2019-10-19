<script>
  export let test;
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
  .failure {
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
  }
  .failure::before {
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
      style="background-color: {testcase.failure ? 'red' : 'rgb(33, 214, 88)'}"
      on:mouseenter={() => (testcase.mouseover = true)}
      on:mouseleave={() => (testcase.mouseover = false)}>
      <div
        class="failure"
        style="opacity: {testcase.mouseover && testcase.failure ? '1' : '0'}">
        <div class="name">{testcase.class}:{testcase.name}</div>
        <div class="error">{testcase.failure}</div>
      </div>
    </div>
  {/each}
</div>

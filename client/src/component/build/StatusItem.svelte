<script>
  export let onClick;

  export let status;
  export let title;
  export let subtitle;
  let style =
    status == 0
      ? "rgb(0, 200, 0)"
      : status === -1
      ? "rgb(170, 170, 170)"
      : "rgb(200, 0, 0)";
</script>

<style>
  .build {
    position: relative;
    padding: 15px;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
  }

  .build:hover {
    padding-left: 20px;
  }

  .title {
    font-size: 18px;
    font-weight: 900;
  }
  .subtitle {
    color: rgba(0, 0, 0, 0.7);
    font-size: 10px;
  }
  .status {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 5px;
    height: 100%;
  }

  .in_progress {
    opacity: 0;
    animation: blink 3s ease-in-out infinite;
  }

  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>

<div class="build" on:click={onClick}>
  <div
    class="status{status === -1 ? ' in_progress' : ''}"
    style="background-color: {style}" />
  <div class="title">{title}</div>
  <div class="subtitle">{subtitle}</div>
</div>

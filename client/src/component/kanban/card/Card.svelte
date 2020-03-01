<script>
  export let name, id, shortDescription, age, onClick, expanded, loading;

  let hover = false;
  function clicked() {
    if (onClick) onClick.apply(this, []);
  }

  function shortenText(text) {
    const cutof = 75;
    const width = 25;
    let spaceIndex = text.substring(cutof, width).indexOf(" ");
    return (
      text.substring(0, cutof + (spaceIndex > 0 ? spaceIndex : 0)) +
      (text.length > cutof ? "..." : "")
    );
  }
</script>

<style>
  .card {
    cursor: grab;
  }
  .animated {
    transition: all 0.2s ease-in-out;
  }
  .hidden {
    opacity: 0;
  }
  .hover {
    opacity: 1;
  }
  .icon.clickable {
    cursor: pointer;
  }
</style>

<div class="card">
  <div class="content">
    <div class="right floated">
      <div class="ui placeholder">
        <div class="image square" />
      </div>
    </div>
    <div class="ui placeholder">
      <div class="paragraph">
        <div class="medium line" />
        <div class="short line" />
        <div class="line" />
        <div class="line" />
        <div class="line" />
      </div>
    </div>
  </div>
</div>

<div
  class="card"
  on:click={clicked}
  on:mouseover={() => (hover = true)}
  on:mouseleave={() => (hover = false)}>
  <div class="content">
    <div class="right floated">
      <i
        class="expand icon clickable small hidden animated {hover ? 'hover' : ''}" />

      <i class="user circle icon large" />
    </div>
    <!-- <img
        class="right floated mini ui image"
        src="/images/avatar/large/elliot.jpg"
        alt="owner avatar" /> -->
    <div class="header">{name}</div>
    <div class="meta">{id}</div>
    <div class="description">{shortenText(shortDescription)}</div>
  </div>
  <div class="extra content">
    <div class="ui">
      {#each Array(age).slice(0, 20) as a, i}
        <i
          class="circle icon tiny {i > 15 ? 'red' : ''}
          {i < 5 ? 'green' : ''}" />
      {/each}
    </div>
  </div>
</div>

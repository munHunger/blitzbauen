<script>
  import Card from "./Card.svelte";
  export let props;
</script>

<div class="ui grid">
  <div class="column">
    <div class="ui cards segment">
      <Card {...props} />
    </div>
  </div>
</div>

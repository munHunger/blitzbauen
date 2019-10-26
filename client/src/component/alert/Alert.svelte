<script>
  import { addListener } from "../../data";
  let alerts = [];

  addListener(data => {
    addAlert({ title: data.onJobComplete.name, text: "Job complete" });
  });

  function addAlert(alert) {
    console.log("adding alert");
    alerts.push(alert);
    alerts = alerts;
    setTimeout(() => {
      alerts.shift(1);
      alerts = alerts;
    }, 3000);
  }
</script>

<style>
  .alerts {
    position: fixed;
    bottom: 0px;
    right: 0px;
    width: 250px;
  }

  .alert {
    box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.75);
    padding: 15px;
    margin: 15px;
    border-radius: 5px;
  }
</style>

<div class="alerts">
  {#each alerts as al}
    <div class="alert">
      <div class="title">{al.title}</div>
      <div class="text">{al.text}</div>
    </div>
  {/each}
</div>

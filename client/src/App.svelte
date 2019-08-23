<script>
  import createRouter from "@spaceavocado/svelte-router";
  import RouterView from "@spaceavocado/svelte-router/component/view";

  import ApolloClient from "apollo-boost";
  import { client } from "./data";
  import { setClient } from "svelte-apollo";
  import Navbar from "./menu/Navbar.svelte";
  import Settings from "./settings/Settings.svelte";
  import Build from "./build/Build.svelte";
  setClient(client);

  createRouter({
    routes: [
      {
        path: "/settings",
        name: "settings",
        component: Settings
      },
      {
        path: "/build",
        name: "build",
        component: Build
      },
      {
        path: "*",
        component: Build
      }
    ]
  });
</script>

<style>
  :global(body) {
    padding: 0px;
  }
  .content-wrapper {
    box-sizing: border-box;
  }
</style>

<Navbar />
<div class="content-wrapper mui-container-fluid" style="margin-left:5rem">
  <RouterView />
</div>

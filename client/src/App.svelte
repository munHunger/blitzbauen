<script>
  import createRouter from "@spaceavocado/svelte-router";
  import RouterView from "@spaceavocado/svelte-router/component/view";

  import ApolloClient from "apollo-boost";
  import { client } from "./data";
  import { setClient } from "svelte-apollo";
  import Navbar from "./menu/Navbar.svelte";
  import Header from "./header/Header.svelte";
  import Settings from "./settings/Settings.svelte";
  import Build from "./build/Build.svelte";
  import Alert from "./alert/Alert.svelte";
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
    display: inline-block;
    width: 100%;
  }
</style>

<Header />
<div class="content">
  <Navbar />
  <div
    class="mui-container-fluid content-wrapper"
    style="margin-left:5rem; display:inline-block;">
    <RouterView />
  </div>
</div>

<Alert />

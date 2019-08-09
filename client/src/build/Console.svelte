<style>
	.console {
		position: relative;
		width: 800px;
        height: 400px;
        border-radius: 15px;
        padding: 10px;
        box-shadow: inset 0 0 10px #000;
        display: inline-block;
        background-color: rgb(38, 39, 43);
        color: rgb(33, 214, 88);
        font-family: 'Roboto Mono', monospace;
	}
</style>
<script>
	import StatusItem from './StatusItem.svelte';
    import { getClient, query } from 'svelte-apollo';
    import { client, STEP_OUTPUT } from '../data';

    export let jobId;
    export let step;

    $: output = query(client, { query: STEP_OUTPUT, variables: { id: jobId, step: step } })
</script>
<link href="https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap" rel="stylesheet">
<div class="console">
    {#await $output}
        Loading...
    {:then result}
        {result.data.history[0].details[0].output}
    {/await}
</div>
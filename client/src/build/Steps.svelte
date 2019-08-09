<style>
	.steps {
		position: relative;
		box-shadow: 0px 0px 3px black;
		width: 200px;
        height: 100%;
	}
</style>
<script>
	import StatusItem from './StatusItem.svelte';
    import { getClient, query } from 'svelte-apollo';
    import { client, HISTORY } from '../data';

    const steps = query(client, { query: HISTORY })
</script>

<div class="steps">
    {#await $steps}
        Loading...
    {:then result}
        {#each result.data as steps}
            steps
        {/each}
    {/await}
</div>
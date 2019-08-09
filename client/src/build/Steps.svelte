<style>
	.steps {
		position: relative;
		width: 200px;
        height: 100%;
        display: inline-block;
	}
</style>
<script>
	import StatusItem from './StatusItem.svelte';
    import { getClient, query } from 'svelte-apollo';
    import { client, JOBDETAIL } from '../data';
    import { beforeUpdate, afterUpdate } from 'svelte';

    export let jobId;

    $: steps = query(client, { query: JOBDETAIL, variables: { id: jobId } })
</script>

<div class="steps">
    {#await $steps}
        Loading...
    {:then result}
        {#each result.data.history[0].details as step}
            <StatusItem title={step.step} subtitle={step.time} status={step.status}/>
        {/each}
    {/await}
</div>
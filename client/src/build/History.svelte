<style>
	.builds {
		position: relative;
		box-shadow: 0px 0px 3px black;
		width: 200px;
	}
</style>
<script>
	import Thumb from './Thumb.svelte';
    import { getClient, query } from 'svelte-apollo';
    import { client, HISTORY } from '../data';

    const builds = query(client, { query: HISTORY })
</script>

<div class="builds">
    {#await $builds}
        Loading...
    {:then result}
        {#each result.data.history as job}
            <Thumb name={job.name} status={job.status} time={job.timestamp}/>
        {/each}
    {/await}
</div>
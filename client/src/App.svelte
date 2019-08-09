<style>
	:global(body) {
		padding: 0px;
	}
</style>
<script>
	import ApolloClient from 'apollo-boost';
	import { client } from './data';
	import { setClient } from 'svelte-apollo';
	import History from './build/History.svelte';
	import Steps from './build/Steps.svelte';

	setClient(client);

	let state = {}
</script>

<History onSelect={id => state.id = id}/>
{#if state.id}
	<Steps jobId={state.id}/>
{/if}
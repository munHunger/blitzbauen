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
	import Console from './build/Console.svelte';

	setClient(client);

	let state = {}
</script>

<History onSelect={id => state.id = id}/>
{#if state.id}
	<Steps jobId={state.id} onSelect={step => state.step = step}/>
{/if}
{#if state.step && state.id}
	<Console jobId={state.id} step={state.step}/>
{/if}
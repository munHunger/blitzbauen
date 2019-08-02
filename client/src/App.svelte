<script>
	import ApolloClient from 'apollo-boost';
	import { client } from './data';
	import { setClient } from 'svelte-apollo';
	import History from './build/History.svelte';

	setClient(client);
</script>

<History />
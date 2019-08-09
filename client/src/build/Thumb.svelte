<style>
	.build {
		position: relative;
		padding: 15px;
		cursor: pointer;
		transition: all 0.25s ease-in-out;
	}

	.build:hover {
		padding-left: 20px;
	}

	.title {
		font-size: 18px;
		font-weight: 900;
	}
	.timestamp {
		color: rgba(0,0,0,0.7);
		font-size: 10px;
	}
	.status {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 5px;
		height: 100%;
	}
</style>
<script>
	export let status;
	export let name;
	export let time;
	let style = status == 0 ? 'rgb(0, 200, 0)' : 'rgb(200, 0, 0)';
</script>

<div class="build">
	<div class="status" style="background-color: {style}"></div>
	<div class="title">{name}</div>
	<div class="timestamp">{time}</div>
</div>
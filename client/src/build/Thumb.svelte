<style>
	.build {
		position: relative;
		padding: 15px;
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
	let name = 'Blitz';
	let time = '2019-07-30 10:19';
	let status = 'rgb(0, 200, 0)';
</script>

<div class="build">
	<div class="status" style="background-color: {status}"></div>
	<div class="title">{name}</div>
	<div class="timestamp">{time}</div>
</div>
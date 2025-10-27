<script lang="ts">
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section data-testid="main-section">
	<h1 data-testid="main-heading">
		<span class="welcome" data-testid="welcome-image">
			<picture data-testid="welcome-picture">
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" data-testid="welcome-img" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2 data-testid="subheading">
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column" data-testid="about-page">
	<h1 data-testid="about-title">About this app</h1>

	<p data-testid="about-description">
		This is a <a href="https://svelte.dev/docs/kit" data-testid="sveltekit-link">SvelteKit</a> app. You can make your own by typing
		the following into your command line and following the prompts:
	</p>

	<pre data-testid="command-example">npx sv create</pre>

	<p data-testid="static-info">
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p data-testid="sverdle-info">
		The <a href="/sverdle" data-testid="sverdle-link">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>
</div>

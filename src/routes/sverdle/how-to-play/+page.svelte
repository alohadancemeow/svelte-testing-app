<svelte:head>
	<title>How to play Sverdle</title>
	<meta name="description" content="How to play Sverdle" />
</svelte:head>

<div class="text-column" data-testid="how-to-play-page">
	<h1 data-testid="page-title">How to play Sverdle</h1>

	<p data-testid="intro-text">
		Sverdle is a clone of <a href="https://www.nytimes.com/games/wordle/index.html" data-testid="wordle-link">Wordle</a>, the
		word guessing game. To play, enter a five-letter English word. For example:
	</p>

	<div class="example" data-testid="first-example">
		<span class="close" data-testid="letter-close-r">r</span>
		<span class="missing" data-testid="letter-missing-i">i</span>
		<span class="close" data-testid="letter-close-t">t</span>
		<span class="missing" data-testid="letter-missing-z">z</span>
		<span class="exact" data-testid="letter-exact-y">y</span>
	</div>

	<p data-testid="explanation-text">
		The <span class="exact">y</span> is in the right place. <span class="close">r</span> and
		<span class="close">t</span>
		are the right letters, but in the wrong place. The other letters are wrong, and can be discarded.
		Let's make another guess:
	</p>

	<div class="example" data-testid="second-example">
		<span class="exact" data-testid="letter-exact-p">p</span>
		<span class="exact" data-testid="letter-exact-a">a</span>
		<span class="exact" data-testid="letter-exact-r">r</span>
		<span class="exact" data-testid="letter-exact-t">t</span>
		<span class="exact" data-testid="letter-exact-y2">y</span>
	</div>

	<p data-testid="success-text">This time we guessed right! You have <strong data-testid="guess-count">six</strong> guesses to get the word.</p>

	<p data-testid="server-info">
		Unlike the original Wordle, Sverdle runs on the server instead of in the browser, making it
		impossible to cheat. It uses <code data-testid="form-code">&lt;form&gt;</code> and cookies to submit data, meaning you can
		even play with JavaScript disabled!
	</p>
</div>

<style>
	span {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 0.8em;
		width: 2.4em;
		height: 2.4em;
		background-color: white;
		box-sizing: border-box;
		border-radius: 2px;
		border-width: 2px;
		color: rgba(0, 0, 0, 0.7);
	}

	.missing {
		background: rgba(255, 255, 255, 0.5);
		color: rgba(0, 0, 0, 0.5);
	}

	.close {
		border-style: solid;
		border-color: var(--color-theme-2);
	}

	.exact {
		background: var(--color-theme-2);
		color: white;
	}

	.example {
		display: flex;
		justify-content: flex-start;
		margin: 1rem 0;
		gap: 0.2rem;
	}

	.example span {
		font-size: 1.4rem;
	}

	p span {
		position: relative;
		border-width: 1px;
		border-radius: 1px;
		font-size: 0.4em;
		transform: scale(2) translate(0, -10%);
		margin: 0 1em;
	}
</style>

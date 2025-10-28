import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import HowToPlayPage from './+page.svelte';

describe('How to Play Page - Essential Tests', () => {
	beforeEach(async () => {
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 50));
	});

	it('should render the how-to-play page', async () => {
		render(HowToPlayPage);

		const howToPlayPage = page.getByTestId('how-to-play-page');
		expect(howToPlayPage).toBeInTheDocument();
	});

	it('should display the main title', async () => {
		render(HowToPlayPage);

		const title = page.getByTestId('page-title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('How to play Sverdle');
	});

	it('should display essential content sections', async () => {
		render(HowToPlayPage);

		const introText = page.getByTestId('intro-text');
		const explanationText = page.getByTestId('explanation-text');
		const successText = page.getByTestId('success-text');
		const serverInfo = page.getByTestId('server-info');

		expect(introText).toBeInTheDocument();
		expect(explanationText).toBeInTheDocument();
		expect(successText).toBeInTheDocument();
		expect(serverInfo).toBeInTheDocument();
	});

	it('should display game examples with different letter states', async () => {
		render(HowToPlayPage);

		const firstExample = page.getByTestId('first-example');
		const secondExample = page.getByTestId('second-example');

		expect(firstExample).toBeInTheDocument();
		expect(secondExample).toBeInTheDocument();

		// Test different letter states in first example
		const closeLetterR = page.getByTestId('letter-close-r');
		const missingLetterI = page.getByTestId('letter-missing-i');
		const exactLetterY = page.getByTestId('letter-exact-y');

		expect(closeLetterR).toBeInTheDocument();
		expect(missingLetterI).toBeInTheDocument();
		expect(exactLetterY).toBeInTheDocument();
	});

	it('should have external Wordle link', async () => {
		render(HowToPlayPage);

		const wordleLink = page.getByTestId('wordle-link');

		expect(wordleLink).toBeInTheDocument();
		expect(wordleLink).toHaveAttribute('href', 'https://www.nytimes.com/games/wordle/index.html');
		expect(wordleLink).toHaveTextContent('Wordle');
	});

	it('should display the guess count information', async () => {
		render(HowToPlayPage);

		const guessCount = page.getByTestId('guess-count');

		expect(guessCount).toBeInTheDocument();
		expect(guessCount).toHaveTextContent('six');
	});
});
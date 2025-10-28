import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import SverdlePage from './+page.svelte';

describe('Sverdle Game Page - Essential UI Tests', () => {
	// Mock data structure based on the page server load function
	const mockData = {
		guesses: ['', '', '', '', '', ''],
		answers: [],
		answer: null
	};

	const mockForm = null;

	beforeEach(async () => {
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 50));
	});

	it('should render the Sverdle game page', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const gameForm = page.getByTestId('sverdle-game-form');
		expect(gameForm).toBeInTheDocument();
	});

	it('should display the page title in head', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		// Check if title is set (this tests the svelte:head section)
		expect(document.title).toBe('Sverdle');
	});

	it('should display the game grid with 6 rows', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const gameGrid = page.getByTestId('game-grid');
		expect(gameGrid).toBeInTheDocument();

		// Check that all 6 rows are present
		for (let row = 0; row < 6; row++) {
			const gameRow = page.getByTestId(`game-row-${row}`);
			expect(gameRow).toBeInTheDocument();
		}
	});

	it('should display 5 letter cells in each row', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		// Check first row has 5 letter cells
		for (let col = 0; col < 5; col++) {
			const letterCell = page.getByTestId(`letter-0-${col}`);
			expect(letterCell).toBeInTheDocument();
		}

		// Check last row has 5 letter cells
		for (let col = 0; col < 5; col++) {
			const letterCell = page.getByTestId(`letter-5-${col}`);
			expect(letterCell).toBeInTheDocument();
		}
	});

	it('should display the keyboard interface', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const keyboard = page.getByTestId('keyboard');
		expect(keyboard).toBeInTheDocument();

		// Check essential keyboard buttons
		const enterButton = page.getByTestId('enter-button');
		const backspaceButton = page.getByTestId('backspace-button');

		expect(enterButton).toBeInTheDocument();
		expect(backspaceButton).toBeInTheDocument();
	});

	it('should display letter keys on keyboard', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		// Test a few key letters from different rows
		const keyQ = page.getByTestId('key-q');
		const keyA = page.getByTestId('key-a');
		const keyZ = page.getByTestId('key-z');

		expect(keyQ).toBeInTheDocument();
		expect(keyA).toBeInTheDocument();
		expect(keyZ).toBeInTheDocument();

		// Check they display the correct letter
		expect(keyQ).toHaveTextContent('q');
		expect(keyA).toHaveTextContent('a');
		expect(keyZ).toHaveTextContent('z');
	});

	it('should display how-to-play navigation link', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const howToPlayLink = page.getByTestId('how-to-play-link');

		expect(howToPlayLink).toBeInTheDocument();
		expect(howToPlayLink).toHaveAttribute('href', '/sverdle/how-to-play');
		expect(howToPlayLink).toHaveTextContent('How to play');
	});

	it('should display game controls section', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const gameControls = page.getByTestId('game-controls');
		expect(gameControls).toBeInTheDocument();
	});

	it('should have enter button disabled when no guess is entered', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const enterButton = page.getByTestId('enter-button');
		expect(enterButton).toBeDisabled();
	});

	it('should have enter button enabled when a complete guess is entered', async () => {
		// Mock data with a 5-letter guess in progress
		const mockDataWithGuess = {
			guesses: ['hello', '', '', '', '', ''],
			answers: [],
			answer: null
		};

		render(SverdlePage, {
			props: {
				data: mockDataWithGuess,
				form: mockForm
			}
		});

		const enterButton = page.getByTestId('enter-button');
		expect(enterButton).toBeEnabled();
	});

	it('should have backspace button always enabled', async () => {
		render(SverdlePage, {
			props: {
				data: mockData,
				form: mockForm
			}
		});

		const backspaceButton = page.getByTestId('backspace-button');
		expect(backspaceButton).toBeEnabled();
	});

});
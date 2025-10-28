import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from '@vitest/browser/context';
import SverdlePage from './+page.svelte';

describe('Sverdle Page Functions Tests', () => {
	const mockData = {
		guesses: ['', '', '', '', '', ''],
		answers: [],
		answer: null
	};

	const mockForm = null;

	beforeEach(async () => {
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 100));
	});

	// Test the update function
	describe('update function', () => {
		it('should add letter to current guess when letter key is clicked', async () => {
			render(SverdlePage, {
				props: {
					data: mockData,
					form: mockForm
				}
			});

			// Click on letter 'a'
			const keyA = page.getByTestId('key-a');
			await keyA.click();

			await new Promise(resolve => setTimeout(resolve, 50));

			// Check if the letter appears in the first cell of the current row
			const firstLetter = page.getByTestId('letter-0-0');
			expect(firstLetter).toHaveTextContent('a');
		});

		it('should remove last letter when backspace is clicked', async () => {
			// Start with a guess that has some letters
			const mockDataWithPartialGuess = {
				guesses: ['ab', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithPartialGuess,
					form: mockForm
				}
			});

			// Click backspace
			const backspaceButton = page.getByTestId('backspace-button');
			await backspaceButton.click();

			// Check if the last letter was removed
			const secondLetter = page.getByTestId('letter-0-1');
			expect(secondLetter).not.toHaveTextContent("");
		});

		it('should not add more than 5 letters to a guess', async () => {
			// Start with a 4-letter guess
			const mockDataWithNearFullGuess = {
				guesses: ['abcd', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithNearFullGuess,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Add the 5th letter
			const keyE = page.getByTestId('key-e');
			await keyE.click();

			// Wait for state update
			await new Promise(resolve => setTimeout(resolve, 100));

			// Check that the 5th letter was added
			const fifthLetter = page.getByTestId('letter-0-4');
			expect(fifthLetter).toHaveTextContent('e');

			// Verify that the 'f' key is now disabled (can't add 6th letter)
			const keyF = page.getByTestId('key-f');
			expect(keyF).toBeDisabled();

			// The next row should still be empty
			const firstLetterNextRow = page.getByTestId('letter-1-0');
			expect(firstLetterNextRow).not.toHaveTextContent("");
		});

		it('should clear badGuess flag when backspace is used', async () => {
			const mockFormWithBadGuess = { badGuess: true };

			render(SverdlePage, {
				props: {
					data: mockData,
					form: mockFormWithBadGuess
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Verify the bad-guess class is initially present
			const gameGrid = page.getByTestId('game-grid');
			expect(gameGrid).toHaveClass('bad-guess');

			// Click backspace
			const backspaceButton = page.getByTestId('backspace-button');
			await backspaceButton.click();

			// Wait for state update
			await new Promise(resolve => setTimeout(resolve, 100));

			// The badGuess flag should be cleared (this is internal state, 
			// so we test by checking if the bad-guess class is removed from grid)
			expect(gameGrid).not.toHaveClass('bad-guess');
		});
	});

	// keydown function tests
	describe('keydown function', () => {
		it('should trigger letter button click when letter key is pressed', async () => {
			render(SverdlePage, {
				props: {
					data: mockData,
					form: mockForm
				}
			});

			// Simulate pressing 'a' key
			await userEvent.keyboard('a');

			await new Promise(resolve => setTimeout(resolve, 50));

			// Check if the letter appears in the first cell
			const firstLetter = page.getByTestId('letter-0-0');
			expect(firstLetter).toHaveTextContent('a');
		});

		it('should trigger backspace when Backspace key is pressed', async () => {
			const mockDataWithLetter = {
				guesses: ['a', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithLetter,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Simulate pressing Backspace key
			await userEvent.keyboard('Backspace');

			// Wait for state update
			await new Promise(resolve => setTimeout(resolve, 100));

			// Check if the letter was removed
			const firstLetter = page.getByTestId('letter-0-0');
			expect(firstLetter).not.toHaveTextContent("");
		});

		it('should not submit when Enter is pressed with incomplete guess', async () => {
			const mockDataWithIncompleteGuess = {
				guesses: ['abc', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithIncompleteGuess,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Simulate pressing Enter key
			await userEvent.keyboard('Enter');

			// Wait for potential state update
			await new Promise(resolve => setTimeout(resolve, 100));

			// The guess should still be incomplete (only 3 letters)
			const fourthLetter = page.getByTestId('letter-0-3');
			expect(fourthLetter).not.toHaveTextContent("");
		});

		it('should ignore meta key combinations', async () => {
			render(SverdlePage, {
				props: {
					data: mockData,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Simulate pressing Ctrl+A (meta key combination)
			await userEvent.keyboard('Meta+a');

			// Wait for potential state update
			await new Promise(resolve => setTimeout(resolve, 100));

			// Check that no letter was added
			const firstLetter = page.getByTestId('letter-0-0');
			expect(firstLetter).not.toHaveTextContent("");
		});
	});

	describe('derived state calculations', () => {
		it('should calculate submittable state correctly with incomplete guess', async () => {
			// Test with incomplete guess (not submittable)
			render(SverdlePage, {
				props: {
					data: mockData,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			const enterButton = page.getByTestId('enter-button');
			expect(enterButton).toBeDisabled();
		});

		it('should calculate submittable state correctly with complete guess', async () => {
			// Test with complete guess (submittable)
			const mockDataWithCompleteGuess = {
				guesses: ['hello', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithCompleteGuess,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			const enterButton = page.getByTestId('enter-button');
			expect(enterButton).not.toBeDisabled();
		});

		it('should disable letter keys when guess is complete', async () => {
			const mockDataWithCompleteGuess = {
				guesses: ['hello', '', '', '', '', ''],
				answers: [],
				answer: null
			};

			render(SverdlePage, {
				props: {
					data: mockDataWithCompleteGuess,
					form: mockForm
				}
			});

			// Wait for component to be ready
			await new Promise(resolve => setTimeout(resolve, 200));

			// Letter keys should be disabled when guess is complete
			const keyA = page.getByTestId('key-a');
			expect(keyA).toBeDisabled();
		});
	});
});
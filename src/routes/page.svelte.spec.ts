import { beforeEach, afterEach, describe, test, expect } from 'vitest';
import { render, cleanup } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import Page from './+page.svelte';

describe('Home Page - Essential Tests', () => {
	beforeEach(async () => {
		// Clean setup for each test
		document.head.innerHTML = '';
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 50));
	});

	// 1. ESSENTIAL: Page renders correctly
	test('should render the page with main content', async () => {
		render(Page);
		
		const mainSection = page.getByTestId('main-section');
		const heading = page.getByTestId('main-heading');

		await expect.element(mainSection).toBeInTheDocument();
		await expect.element(heading).toBeInTheDocument();
		await expect.element(heading).toHaveTextContent(/to your new.*SvelteKit app/);
	});

	// 2. ESSENTIAL: Page title is set correctly
	test('should set the correct page title', async () => {
		render(Page);
		
		expect(document.title).toBe('Home');
	});

	// 3. ESSENTIAL: Counter component renders
	test('should render counter component', async () => {
		render(Page);
		
		const counter = page.getByTestId('counter');
		const counterValue = page.getByTestId('counter-value');
		const increaseButton = page.getByTestId('counter-increase');
		const decreaseButton = page.getByTestId('counter-decrease');

		await expect.element(counter).toBeInTheDocument();
		await expect.element(counterValue).toBeInTheDocument();
		await expect.element(increaseButton).toBeInTheDocument();
		await expect.element(decreaseButton).toBeInTheDocument();
	});

	// 4. CRITICAL: Counter functionality works
	test('should increment counter when increase button is clicked', async () => {
		render(Page);
		
		const counterValue = page.getByTestId('counter-value');
		const increaseButton = page.getByTestId('counter-increase');

		// Initial value should be 0
		await expect.element(counterValue).toHaveTextContent('0');

		// Click increase button
		await increaseButton.click();
		await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation

		// Value should be 1
		await expect.element(counterValue).toHaveTextContent('1');
	});

	test('should decrement counter when decrease button is clicked', async () => {
		render(Page);
		
		const counterValue = page.getByTestId('counter-value');
		const decreaseButton = page.getByTestId('counter-decrease');

		// Initial value should be 0
		await expect.element(counterValue).toHaveTextContent('0');

		// Click decrease button
		await decreaseButton.click();
		await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation

		// Value should be -1
		await expect.element(counterValue).toHaveTextContent('-1');
	});

	// 5. IMPORTANT: Basic accessibility
	test('should have proper accessibility attributes', async () => {
		render(Page);
		
		const increaseButton = page.getByTestId('counter-increase');
		const decreaseButton = page.getByTestId('counter-decrease');
		const welcomeImage = page.getByTestId('welcome-img');

		// Buttons should have aria-labels
		await expect.element(increaseButton).toHaveAttribute('aria-label', 'Increase the counter by one');
		await expect.element(decreaseButton).toHaveAttribute('aria-label', 'Decrease the counter by one');

		// Image should have alt text
		await expect.element(welcomeImage).toHaveAttribute('alt', 'Welcome');
	});

	// 6. IMPORTANT: Multiple interactions work correctly
	test('should handle multiple counter interactions', async () => {
		render(Page);
		
		const counterValue = page.getByTestId('counter-value');
		const increaseButton = page.getByTestId('counter-increase');
		const decreaseButton = page.getByTestId('counter-decrease');

		// Start at 0
		await expect.element(counterValue).toHaveTextContent('0');

		// Increase twice
		await increaseButton.click();
		await new Promise(resolve => setTimeout(resolve, 50));
		await increaseButton.click();
		await new Promise(resolve => setTimeout(resolve, 100));
		await expect.element(counterValue).toHaveTextContent('2');

		// Decrease once
		await decreaseButton.click();
		await new Promise(resolve => setTimeout(resolve, 100));
		await expect.element(counterValue).toHaveTextContent('1');
	});
});

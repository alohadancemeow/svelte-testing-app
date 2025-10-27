import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import AboutPage from './+page.svelte';

describe('About Page - Essential Tests', () => {
	beforeEach(async () => {
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 50));
	});

	const renderAboutPage = () => render(AboutPage);

	it('should render the about page', async () => {
		renderAboutPage();
		expect(page.getByTestId('about-page')).toBeInTheDocument();
	});

	it('should display the main title', async () => {
		renderAboutPage();
		const title = page.getByTestId('about-title');
		expect(title).toBeInTheDocument();
		expect(title).toHaveTextContent('About this app');
	});

	it('should have essential navigation links', async () => {
		renderAboutPage();
		const [svelteKitLink, sverdleLink] = await Promise.all([
			page.getByTestId('sveltekit-link'),
			page.getByTestId('sverdle-link')
		]);

		expect(svelteKitLink).toBeInTheDocument();
		expect(svelteKitLink).toHaveAttribute('href', 'https://svelte.dev/docs/kit');

		expect(sverdleLink).toBeInTheDocument();
		expect(sverdleLink).toHaveAttribute('href', '/sverdle');
	});
});
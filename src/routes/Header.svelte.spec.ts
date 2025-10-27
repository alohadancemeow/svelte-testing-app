import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import Header from './Header.svelte';

describe('Header Component - Essential Tests', () => {
	beforeEach(async () => {
		document.body.innerHTML = '';
		await new Promise(resolve => setTimeout(resolve, 50));
	});

	it('should render the header component', async () => {
		render(Header);

		const header = page.getByTestId('header');
		expect(header).toBeInTheDocument();
	});

	it('should render all navigation links', async () => {
		render(Header);

		const homeLink = page.getByTestId('nav-link-home');
		const aboutLink = page.getByTestId('nav-link-about');
		const sverdleLink = page.getByTestId('nav-link-sverdle');

		expect(homeLink).toBeInTheDocument();
		expect(aboutLink).toBeInTheDocument();
		expect(sverdleLink).toBeInTheDocument();
	});

	it('should have correct navigation link destinations', async () => {
		render(Header);

		const homeLink = page.getByTestId('nav-link-home');
		const aboutLink = page.getByTestId('nav-link-about');
		const sverdleLink = page.getByTestId('nav-link-sverdle');

		expect(homeLink).toHaveAttribute('href', '/');
		expect(aboutLink).toHaveAttribute('href', '/about');
		expect(sverdleLink).toHaveAttribute('href', '/sverdle');
	});
});
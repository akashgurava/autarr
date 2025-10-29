import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const THEME_KEY = 'autarr-theme';

// Initialize theme from localStorage or system preference
function getInitialTheme(): boolean {
	if (!browser) return true; // Default to dark for SSR

	const stored = localStorage.getItem(THEME_KEY);
	if (stored !== null) {
		return stored === 'dark';
	}

	// Check system preference
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const theme = writable<boolean>(getInitialTheme());

// Persist theme changes to localStorage
if (browser) {
	theme.subscribe((isDark) => {
		localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
	});
}

export function toggleTheme() {
	theme.update((d) => !d);
}

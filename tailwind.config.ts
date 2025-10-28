import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{svelte,ts,js}'],
	theme: {
		extend: {}
	}
} satisfies Config;

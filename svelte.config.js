import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Normalize BASE_PATH env var into a value acceptable to SvelteKit's kit.paths.base:
 * - '' (empty string) for root
 * - '/subpath' (must start with '/' and must NOT end with '/')
 */
function normalizeBasePath(raw) {
	const v = (raw ?? '').toString().trim();

	// empty or exactly "/" => root (empty string)
	if (v === '' || v === '/') return '';

	// ensure starts with '/' and drop trailing '/'
	let out = v.startsWith('/') ? v : '/' + v;
	if (out.endsWith('/')) out = out.slice(0, -1);
	return out;
}

const BASE_PATH = normalizeBasePath(process.env.BASE_PATH);

const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		runes: true
	},

	kit: {
		// produce a static build (build/ by default)
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),

		// set base path for assets and routing; normalized above
		paths: {
			base: BASE_PATH
		}
	}
};

export default config;
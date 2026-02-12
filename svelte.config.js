import adapterStatic from '@sveltejs/adapter-static';
import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';

const useCloudflare = process.env.BUILD_ADAPTER === 'cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx'],
	preprocess: [mdsvex({ extensions: ['.svx'] })],
	kit: {
		adapter: useCloudflare
			? adapterCloudflare()
			: adapterStatic({
					fallback: 'index.html'
				})
	}
};

export default config;

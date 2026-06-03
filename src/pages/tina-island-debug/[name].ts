import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { islands } from '../../lib/islands';

function errorPayload(error: unknown) {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack,
		};
	}
	return { message: String(error) };
}

export const prerender = false;

export const GET: APIRoute = async ({ params, request, url }) => {
	const island = islands[params.name ?? ''];
	if (!island) {
		return Response.json({ error: `Unknown island "${params.name}"` }, { status: 404 });
	}

	let data: unknown;
	try {
		data = await island.fetch(request, url.searchParams);
	} catch (error) {
		return Response.json({ step: 'fetch', error: errorPayload(error) }, { status: 500 });
	}

	try {
		const container = await AstroContainer.create();
		await container.renderToString(island.component, {
			props: island.propsFromData(data, url.searchParams),
		});
	} catch (error) {
		return Response.json({ step: 'render', error: errorPayload(error) }, { status: 500 });
	}

	return Response.json({ ok: true });
};

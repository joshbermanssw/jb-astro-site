import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = () => {
	let parsed: string | null = null;
	let error: unknown = null;

	try {
		parsed = new URL(import.meta.url).toString();
	} catch (caught) {
		error = caught instanceof Error
			? { name: caught.name, message: caught.message, stack: caught.stack }
			: { message: String(caught) };
	}

	return Response.json({
		importMetaUrl: import.meta.url,
		parsed,
		error,
	});
};

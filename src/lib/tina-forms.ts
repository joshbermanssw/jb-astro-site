import type { QueryResult } from '@tinacms/astro/data';

function escapeAttr(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

export function tinaFormPayload<TData>(result: QueryResult<TData>, primary = false) {
	const form = {
		id: result.id,
		query: result.query,
		variables: result.variables,
		data: result.data,
		priority: primary ? 'primary' : undefined,
	};

	return `<div data-tina-form="${escapeAttr(JSON.stringify(form))}"${primary ? ' data-tina-primary' : ''} hidden></div>`;
}

<script lang="ts">
	import { isFilled, type LinkField } from '@prismicio/client';
	import { PrismicLink } from '@prismicio/svelte';

	export let linkField: LinkField;
	export let label = 'Learn more';
</script>

{#if isFilled.link(linkField)}
	<PrismicLink
		field={linkField}
		class="inline-flex w-fit items-center rounded-full border border-slate-300/20 bg-slate-100 px-5 py-3 text-sm font-bold tracking-wide text-slate-950 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-yellow-400"
	>
		{label}
	</PrismicLink>
{/if}

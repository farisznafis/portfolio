<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicRichText, type SliceComponentProps } from '@prismicio/svelte';
	import Label from './Label.svelte';

	type Props = SliceComponentProps<Content.RichTextSlice>;

	const { slice }: Props = $props();
</script>

<section class="mx-auto max-w-2xl px-4 py-24 text-slate-200 md:px-6">
	<PrismicRichText
		field={slice.primary.content}
		components={{
			label: Label
		}}
	/>
</section>

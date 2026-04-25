<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { PrismicImage, PrismicRichText } from '@prismicio/svelte';
	import Button from '$lib/components/Button.svelte';

	type Props = SliceComponentProps<Content.BiographySlice>;

	const { slice }: Props = $props();
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="px-4 md:px-6"
>
	<div class="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] md:items-center">
		<div class="space-y-6">
			<h2 class="text-3xl font-extrabold tracking-tight text-slate-100 md:text-5xl">
				{slice.primary.heading}
			</h2>
			<div class="space-y-4 text-base leading-7 text-slate-300">
				<PrismicRichText field={slice.primary.description} />
			</div>
			<Button linkField={slice.primary.button_link} />
		</div>
		<PrismicImage
			field={slice.primary.avatar}
			class="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-2xl shadow-black/30"
			imgixParams={{ q: 90 }}
		/>
	</div>
</section>

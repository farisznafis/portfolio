<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';

	type Props = SliceComponentProps<Content.HeroSlice>;

	const { slice }: Props = $props();
</script>

<section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
    <h1>
        <span>
            {slice.primary.first_name}
        </span>   
        <span>
            {slice.primary.last_name}
        </span>
    </h1>
    <span>
        {slice.primary.tagline}
    </span>

</section>

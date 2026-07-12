<script lang="ts">
	import type { Content } from '@prismicio/client';
	import type { SliceComponentProps } from '@prismicio/svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Scene from './Scene.svelte';

	type Props = SliceComponentProps<Content.HeroSlice>;

	const { slice }: Props = $props();

	const primary = slice.primary;

	const firstNameLetters = primary.first_name ? Array.from(primary.first_name) : [];
	const middleNameLetters = primary.middle_name ? Array.from(primary.middle_name) : [];
	const lastNameLetters = primary.last_name ? Array.from(primary.last_name) : [];
	const fullName = [primary.first_name, primary.middle_name, primary.last_name].filter(Boolean).join(' ');

	onMount(() => {
		const tl = gsap.timeline();

		tl.fromTo(
			'.name-animation',
			{
				x: 0,
				opacity: 0,
				rotate: -10
			},
			{
				x: 0,
				rotate: 0,
				opacity: 1,
				ease: 'elastic.out(1, 0.3)',
				duration: 1,
				transformOrigin: 'left top',
				delay: 0.5,
				stagger: {
					each: 0.1,
					from: 'random'
				}
			}
		);
		tl.fromTo(
			'.job-title',
			{
				y: 20,
				opacity: 0,
				scale: 1.2
			},
			{
				opacity: 1,
				y: 0,
				scale: 1,
				ease: 'elastic.out(1, 0.3)'
			}
		);
	});
</script>

<section
	data-slice-type={slice.slice_type}
	data-slice-variation={slice.variation}
	class="px-4 md:px-6"
>
	<div class="mx-auto w-full max-w-6xl">
		<div class="grid min-h-[65vh] grid-cols-1 items-center md:grid-cols-2">
			<div
				class="relative z-10 row-span-1 row-start-1 -my-16 aspect-[1/1.3] overflow-hidden md:col-span-1 md:col-start-2 md:mt-0"
			>
				<Scene />
			</div>
			<div class="col-start-1 md:row-start-1">
				<h1
					class="mb-2 text-[clamp(3rem,20vmin,13rem)] font-extrabold leading-none tracking-tighter text-wrap md:mb-2"
					aria-label={fullName}
				>
					{#if firstNameLetters.length && lastNameLetters.length}
						<span class="block text-slate-200">
							{#each firstNameLetters as letter}
								<span class="name-animation inline-block opacity-100">{letter}</span>
							{/each}
						</span>
						<span class="block text-slate-400 -mt-[.2em]">
							{#each middleNameLetters as letter}
								<span class="name-animation inline-block opacity-100">{letter}</span>
							{/each}
						</span>
						<span class="block text-slate-600 -mt-[.2em]">
							{#each lastNameLetters as letter}
								<span class="name-animation inline-block opacity-100">{letter}</span>
							{/each}
						</span>
					{/if}
				</h1>

				<span
					class="job-title block bg-linear-to-tr from-yellow-500 via-yellow-200 to-yellow-500 bg-clip-text text-2xl font-bold uppercase tracking-[.2em] text-transparent opacity-0 md:text-4xl"
				>
					{primary.tagline}
				</span>
			</div>
		</div>
	</div>
</section>

<script lang="ts">
	import type { Content } from '@prismicio/client';
	import { PrismicLink } from '@prismicio/svelte';

	export let settings: Content.SettingsDocument;

	let open = false;

	const closeMenu = () => {
		open = false;
	};
</script>

<header class="relative top-0 z-50 mx-auto w-full max-w-6xl md:sticky md:top-0">
	<nav>
		<div
			class="flex flex-col justify-between rounded-b-lg bg-slate-50 px-4 py-2 md:m-4 md:flex-row md:items-center md:rounded-md"
		>
			<div class="flex items-center justify-between">
				<a
					href="/"
					aria-label="Homepage"
					class="text-xl font-extrabold tracking-tighter text-slate-900"
				>
					{settings.data.name}
				</a>
				<button
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Open Menu"
					class="block p-2 text-2xl text-slate-800 md:hidden"
					onclick={() => (open = true)}
				>
					OPEN
				</button>
			</div>
			<ul
				id="mobile-menu"
				class={`fixed inset-0 z-50 flex flex-col gap-4 bg-slate-50 px-4 pt-14 transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<li class="flex justify-end">
					<button
						aria-label="Close Menu"
						class="block p-2 text-2xl text-slate-800"
						onclick={closeMenu}
					>
						CLOSE
					</button>
				</li>
				{#each settings.data.nav_item as { link, label }}
					<li class="text-right">
						<PrismicLink
							field={link}
							class="text-3xl font-bold tracking-tight text-slate-900"
							onclick={closeMenu}
						>
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
			<ul class="hidden items-center gap-2 md:flex">
				{#each settings.data.nav_item as { link, label }}
					<li>
						<PrismicLink
							field={link}
							class="rounded-full px-3 py-1 text-sm font-bold tracking-wide text-slate-700 transition-colors duration-150 hover:bg-slate-200 hover:text-slate-950"
						>
							{label}
						</PrismicLink>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</header>

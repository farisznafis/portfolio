<script lang="ts">
    import '../app.css';
    import '@fontsource-variable/urbanist';
    import { PrismicPreview } from '@prismicio/svelte/kit';
    import { page } from '$app/state';
    import { repositoryName } from '$lib/prismicio';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';

    export let data;
</script>

<svelte:head>
    <title>{page.data.title}</title>
    {#if page.data.meta_description}
        <meta name="description" content={page.data.meta_description} />
    {/if}
    {#if page.data.meta_title}
        <meta property="og:title" content={page.data.meta_title} />
    {/if}
    {#if page.data.meta_image}
        <meta property="og:image" content={page.data.meta_image} />
        <meta name="twitter:card" content="summary_large_image" />
    {/if}
</svelte:head>

<div class="relative isolate h-dvh overflow-hidden bg-slate-900">
    <div class="background-gradient fixed inset-0 z-0"></div>
    <div
        class="pointer-events-none fixed inset-0 z-10 bg-[url('/noisetexture.jpg')] opacity-20 mix-blend-soft-light"
    ></div>

    <div class="relative z-20 flex h-full flex-col">
        <Header settings={data.settings} />
        <main class="flex-1 overflow-hidden">
            <slot />
        </main>
        <Footer settings={data.settings} />
        <PrismicPreview {repositoryName} />
    </div>
</div>
<script lang="ts">
	import type { Content } from "@prismicio/client";

    export let settings: Content.SettingsDocument;
</script>

<header>
    <nav>
        <div>
            <div>
                <a href="/" aria-label="Homepage" class="text-xl font-extrabold tracking-tighter text-slate-900">{settings.data.name}</a>
            </div>
        </div>
    </nav>
</header>
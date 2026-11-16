# The gallery after hours

`/gallery` is an exhibition hall at night, built from data. Each series is a
wing; each photo is a framed print with its own picture light. The rules of
the medium (surfaces, light, flaws, camera) are the comment at the top of
`Hall.tsx`.

## Data flow

```
JPEGs in a folder
   │  npm run gallery:import -- <folder> --series <slug>     (scripts/gallery.ts)
   ▼
public/media/gallery/<series>/<photo>/<hash>-<256|1024|2560>.<avif|webp>   files, GPS stripped
app/content/gallery.generated.json                                         series + photos, committed
   │                                   └─► Supabase mirror: bucket `portfolio-media`, tables `gallery_*`
   ▼                                        (same command, or `npm run gallery:seed` later)
app/lib/data/gallery.ts      getGallery() · getSeries(slug) · getPhoto(series, photo); validates on import
   ▼
app/gallery/layout.tsx       holds <GalleryExperience>, so the hall survives URL changes
app/gallery/page.tsx, app/gallery/[series]/[photo]/page.tsx   metadata only
```

The site renders from the JSON, never from Supabase, so a deployment does not
depend on it. Pages call only the three data functions; moving to live
queries later changes `app/lib/data/gallery.ts` and nothing else.

**Where files are served from.** `mediaUrl()` in `app/lib/content/gallery.ts`
reads `public/media` unless `NEXT_PUBLIC_GALLERY_MEDIA_URL` names the bucket
(`https://<ref>.supabase.co/storage/v1/object/public/portfolio-media`). Once
that is set, `public/media/` can go into `.gitignore`: the import script only
needs it as its local cache.

## Adding photos

1. `npm run gallery:import -- ./my-folder --series kumamoto`
   The file name becomes the photo's slug (and so its URL). EXIF gives date,
   camera, lens and exposure; a field the file does not carry stays empty.
2. Open `app/content/gallery.generated.json`. For each new photo write
   `alt.en` and `alt.ja`, optionally `title` and `place`, then set
   `published: true`. A new series also needs `title` and `published`.
   The script prints what is still missing; `npm run gallery:check` repeats it.
3. Mark up to three photos `featured` to put them on the home page's darkroom table.

Re-running the import is safe: an unchanged source file is skipped (its hash
is in the file name), remote files that exist are not uploaded again, and
everything written by hand is kept. The build fails with a clear message if
ids, slugs or sort orders collide, a published photo lacks alt text, or a
`storagePath` is malformed.

## Modules

| File | What it does |
| --- | --- |
| `GalleryExperience.tsx` | Route shell: the open photo (from the URL), Hall / Index, HUD, hidden wing list |
| `plan.ts` | Pure layout: data → wings, prints, walls, doorways; scroll ↔ metres; the lightbox rectangle |
| `Hall.tsx` | R3F scene: camera, scroll walk, attract mode, hover, click-to-zoom flight |
| `materials.ts` | Shaders and geometry. Every picture light is analytic; there are no three.js lights |
| `stream.ts` | Texture arrays with a GPU budget: thumbnails, wall textures, labels, titles |
| `Lightbox.tsx` | The open photo as a real `<img>`, laid exactly over the 3D print |
| `IndexGrid.tsx` | Virtualized contact sheet with filters; the no-WebGL and low-end path |
| `FloorPlan.tsx` | Top-down plan; a wing is a button that walks there |
| `sound.ts` | Room tone and footsteps, WebAudio, only after "Enable sound" |
| `fixture.ts` | Development-only synthetic gallery for stress tests |

## Scale

- Prints, frames, lamps, light pools, reflections and labels are instanced:
  about ten draw calls whether the hall holds 3 photos or 3,000.
- Pictures stream into texture arrays for a window around the camera (30 m
  ahead, 15 m behind): 256 px first, 1024 px within 8 m, each fading in. A
  full array reuses the slot of whatever is farthest away. Budget: 168 MB of
  GPU memory, 56 MB on phones (`BUDGET` in `stream.ts`).
- Resolution drops when frames run long; a device that cannot hold 30 fps is
  handed the Index, with the hall one click away.

## Inspecting a moment

`/gallery?view=entrance` · `?view=wing-<slug>` · `?view=plan` · `?view=index` ·
`?t=<seconds>` (attract walk frozen at that time) · `/gallery/<series>/<photo>`.
In development only, `?fixture=1000` hangs a thousand synthetic placeholders.

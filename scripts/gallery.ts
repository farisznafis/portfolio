/**
 * Gallery pipeline.
 *
 *   npm run gallery:import -- <folder> --series <slug>
 *     JPEGs -> EXIF -> 256/1024/2560 px AVIF + WebP in public/media/ ->
 *     app/content/gallery.generated.json -> Supabase (files + rows).
 *   npm run gallery:seed    mirror the JSON and its files into Supabase
 *   npm run gallery:check   validate the JSON and list what is still unwritten
 *
 * Re-running is safe: a photo whose source bytes are unchanged is skipped
 * (its hash is in the file names), remote files that exist are not uploaded
 * again, and everything written by hand in the JSON is kept.
 */
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import exifr from "exifr";
import sharp from "sharp";

import { validateGallery } from "../app/lib/data/gallery";
import { GALLERY_FORMATS, GALLERY_SIZES, type Gallery, type GalleryPhoto } from "../app/types/gallery";

dotenv.config({ path: ".env.local", quiet: true });

const STORE = "app/content/gallery.generated.json";
const MEDIA = "public/media";
const BUCKET = "portfolio-media";

const files = (photo: GalleryPhoto) =>
  GALLERY_SIZES.flatMap((size) => GALLERY_FORMATS.map((format) => `${photo.storagePath}-${size}.${format}`));

function report(store: Gallery) {
  const problems = validateGallery(store);
  if (problems.length > 0) throw new Error(`Gallery is invalid:\n- ${problems.join("\n- ")}`);
  const series = new Map(store.series.map((s) => [s.id, s]));
  const todo = [
    ...store.series.filter((s) => !(s.title.en && s.title.ja)).map((s) => `series ${s.slug}: title.en / title.ja`),
    ...store.series.filter((s) => s.title.en && s.title.ja && !s.published).map((s) => `series ${s.slug}: published: true`),
    ...store.photos.flatMap((p) => {
      const missing = [!p.alt.en && "alt.en", !p.alt.ja && "alt.ja", !p.published && "published: true"].filter(Boolean);
      return missing.length > 0 ? [`${series.get(p.seriesId)?.slug}/${p.slug}: ${missing.join(", ")}`] : [];
    }),
  ];
  console.log(`${store.series.length} series, ${store.photos.length} photos, ${store.photos.filter((p) => p.published).length} published.`);
  if (todo.length > 0) console.log(`Still to write in ${STORE}:\n- ${todo.join("\n- ")}`);
}

/** Never invents: a field the file does not carry stays undefined. */
async function readExif(source: Buffer) {
  const exif = await exifr
    .parse(source, { pick: ["DateTimeOriginal", "Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength"], reviveValues: false })
    .catch(() => undefined);
  if (!exif) return {};
  const number = (value: unknown) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);
  const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);
  const date = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}:\d{2}:\d{2})/.exec(String(exif.DateTimeOriginal ?? ""));
  const make = text(exif.Make);
  const model = text(exif.Model);
  const exposure = { aperture: number(exif.FNumber), shutter: number(exif.ExposureTime), iso: number(exif.ISO), focalLength: number(exif.FocalLength) };
  return {
    takenAt: date ? `${date[1]}-${date[2]}-${date[3]}T${date[4]}` : undefined,
    camera: model && make && !model.toLowerCase().startsWith(make.toLowerCase()) ? `${make} ${model}` : (model ?? make),
    lens: text(exif.LensModel),
    exposure: Object.values(exposure).some((value) => value !== undefined) ? exposure : undefined,
  };
}

async function importFolder(folder: string, seriesSlug: string, store: Gallery) {
  if (!/^[a-z0-9-]+$/.test(seriesSlug)) throw new Error(`--series must be a slug (a-z, 0-9, -): ${seriesSlug}`);
  const sources = readdirSync(folder).filter((name) => /\.jpe?g$/i.test(name)).sort();
  if (sources.length === 0) throw new Error(`No JPEGs in ${folder}`);

  let series = store.series.find((s) => s.slug === seriesSlug);
  if (!series) {
    series = { id: randomUUID(), slug: seriesSlug, title: { en: "", ja: "" }, sortOrder: Math.max(-1, ...store.series.map((s) => s.sortOrder)) + 1, published: false };
    store.series.push(series);
  }
  const seriesId = series.id;
  const touched: GalleryPhoto[] = [];

  for (const name of sources) {
    const slug = basename(name, extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) throw new Error(`Cannot make a slug from ${name}`);
    const source = readFileSync(join(folder, name));
    const storagePath = `gallery/${seriesSlug}/${slug}/${createHash("sha256").update(source).digest("hex").slice(0, 8)}`;
    const existing = store.photos.find((p) => p.seriesId === seriesId && p.slug === slug);
    const probe = { storagePath } as GalleryPhoto;

    if (existing?.storagePath === storagePath && files(probe).every((file) => existsSync(join(MEDIA, file)))) {
      console.log(`unchanged  ${slug}`);
      touched.push(existing);
      continue;
    }

    const meta = await sharp(source).metadata();
    const turned = (meta.orientation ?? 1) >= 5;
    const directory = join(MEDIA, dirname(storagePath));
    rmSync(directory, { recursive: true, force: true }); // a changed source leaves no stale sizes behind
    mkdirSync(directory, { recursive: true });
    for (const size of GALLERY_SIZES) {
      // sharp writes no metadata unless asked to, so EXIF and GPS never reach an output file.
      const resized = sharp(source).rotate().resize(size, size, { fit: "inside", withoutEnlargement: true });
      for (const format of GALLERY_FORMATS) {
        const output = await (format === "avif" ? resized.clone().avif({ quality: 62 }) : resized.clone().webp({ quality: 84 })).toBuffer();
        if (await exifr.gps(output).catch(() => undefined)) throw new Error(`GPS data survived in ${slug} ${size}.${format}`);
        writeFileSync(join(MEDIA, `${storagePath}-${size}.${format}`), output);
      }
    }
    const blur = await sharp(source).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    const { dominant } = await sharp(source).stats();
    const exif = await readExif(source);
    const photo: GalleryPhoto = {
      id: existing?.id ?? randomUUID(),
      slug,
      seriesId,
      storagePath,
      width: (turned ? meta.height : meta.width) ?? 0,
      height: (turned ? meta.width : meta.height) ?? 0,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      dominantColor: `#${[dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, "0")).join("")}`,
      alt: existing?.alt ?? { en: "", ja: "" },
      title: existing?.title,
      place: existing?.place,
      takenAt: exif.takenAt ?? existing?.takenAt,
      camera: exif.camera ?? existing?.camera,
      lens: exif.lens ?? existing?.lens,
      exposure: exif.exposure ?? existing?.exposure,
      featured: existing?.featured ?? false,
      sortOrder: existing?.sortOrder ?? Math.max(-1, ...store.photos.filter((p) => p.seriesId === seriesId).map((p) => p.sortOrder)) + 1,
      published: existing?.published ?? false,
    };
    if (existing) Object.assign(existing, photo);
    else store.photos.push(photo);
    touched.push(existing ?? photo);
    console.log(`${existing ? "updated  " : "new      "}  ${slug}`);
  }
  return touched;
}

/** Files that are not in the bucket yet, then every row. */
async function mirror(store: Gallery, photos: GalleryPhoto[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY is missing");
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const bucket = supabase.storage.from(BUCKET);
  const must = async (query: PromiseLike<{ error: { message: string } | null }>) => {
    const { error } = await query;
    if (error) throw new Error(error.message);
  };

  // shortcut: one list call per photo, uploads one at a time; batch per series if a seed of thousands gets slow.
  let uploaded = 0;
  for (const photo of photos) {
    const { data, error } = await bucket.list(dirname(photo.storagePath), { limit: 100 });
    if (error) throw new Error(error.message);
    const remote = new Set(data.map((file) => file.name));
    for (const file of files(photo)) {
      if (remote.has(basename(file))) continue;
      await must(bucket.upload(file, readFileSync(join(MEDIA, file)), { contentType: `image/${extname(file).slice(1)}`, cacheControl: "31536000" }));
      uploaded++;
    }
  }

  const both = ["en", "ja"] as const;
  await must(supabase.from("gallery_series").upsert(store.series.map((s) => ({ id: s.id, slug: s.slug, sort_order: s.sortOrder, published: s.published }))));
  await must(
    supabase
      .from("gallery_series_translations")
      .upsert(store.series.flatMap((s) => both.map((locale) => ({ series_id: s.id, locale, title: s.title[locale], description: s.description?.[locale] ?? null })))),
  );
  for (let i = 0; i < store.photos.length; i += 500) {
    const chunk = store.photos.slice(i, i + 500);
    await must(
      supabase.from("gallery_photos").upsert(
        chunk.map((p) => ({
          id: p.id,
          series_id: p.seriesId,
          slug: p.slug,
          storage_path: p.storagePath,
          width: p.width,
          height: p.height,
          blur_data_url: p.blurDataURL,
          dominant_color: p.dominantColor,
          taken_at: p.takenAt ?? null,
          camera: p.camera ?? null,
          lens: p.lens ?? null,
          aperture: p.exposure?.aperture ?? null,
          shutter: p.exposure?.shutter ?? null,
          iso: p.exposure?.iso ?? null,
          focal_length: p.exposure?.focalLength ?? null,
          featured: p.featured,
          sort_order: p.sortOrder,
          published: p.published,
          updated_at: new Date().toISOString(),
        })),
      ),
    );
    await must(
      supabase
        .from("gallery_photo_translations")
        .upsert(chunk.flatMap((p) => both.map((locale) => ({ photo_id: p.id, locale, alt: p.alt[locale], title: p.title?.[locale] ?? null, place: p.place?.[locale] ?? null })))),
    );
  }
  for (const s of store.series) await must(supabase.from("gallery_series").update({ cover_photo_id: s.coverPhotoId ?? null }).eq("id", s.id));
  console.log(`Supabase: ${uploaded} file(s) uploaded, ${store.series.length} series and ${store.photos.length} photos upserted.`);
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const store = JSON.parse(readFileSync(STORE, "utf8")) as Gallery;

  if (command === "check") return report(store);
  if (command === "seed") {
    report(store);
    return mirror(store, store.photos);
  }
  if (command !== "import") throw new Error("Usage: gallery.ts import <folder> --series <slug> | seed | check");

  const flag = rest.indexOf("--series");
  const folder = rest.find((arg, i) => !arg.startsWith("--") && i !== flag + 1);
  if (flag < 0 || !rest[flag + 1] || !folder) throw new Error("Usage: npm run gallery:import -- <folder> --series <slug>");
  const touched = await importFolder(folder, rest[flag + 1], store);
  writeFileSync(STORE, `${JSON.stringify(store, null, 2)}\n`);
  report(store);
  // The JSON and public/media are complete at this point; the mirror can be repeated at any time.
  await mirror(store, touched).catch((error: Error) => {
    console.warn(`Not mirrored to Supabase (${error.message}). Run "npm run gallery:seed" once it is reachable.`);
  });
}

main().catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});

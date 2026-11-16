import store from "../../content/gallery.generated.json";
import type { Gallery, GalleryPhoto, GallerySeries } from "../../types/gallery";

export const STORAGE_PATH = /^gallery\/[a-z0-9-]+\/[a-z0-9-]+\/[0-9a-f]{8}$/;

/** Every problem in the store, as sentences. Empty means valid. */
export function validateGallery(gallery: Gallery): string[] {
  const problems: string[] = [];
  const unique = <T>(items: T[], valueOf: (item: T) => string | number, label: string) => {
    const seen = new Set<string | number>();
    for (const item of items) {
      const value = valueOf(item);
      if (seen.has(value)) problems.push(`Duplicate ${label}: ${value}`);
      seen.add(value);
    }
  };

  unique(gallery.series, (s) => s.id, "series id");
  unique(gallery.series, (s) => s.slug, "series slug");
  unique(gallery.series, (s) => s.sortOrder, "series sortOrder");
  unique(gallery.photos, (p) => p.id, "photo id");
  unique(gallery.photos, (p) => `${p.seriesId}/${p.slug}`, "photo slug within a series");
  unique(gallery.photos, (p) => `${p.seriesId}/${p.sortOrder}`, "photo sortOrder within a series");

  const series = new Map(gallery.series.map((s) => [s.id, s]));
  for (const s of gallery.series)
    if (s.published && !(s.title.en && s.title.ja)) problems.push(`Series "${s.slug}" is published without title.en and title.ja`);
  for (const p of gallery.photos) {
    const name = `Photo "${p.slug}"`;
    const parent = series.get(p.seriesId);
    if (!parent) problems.push(`${name} points at a missing series: ${p.seriesId}`);
    if (!STORAGE_PATH.test(p.storagePath)) problems.push(`${name} has a malformed storagePath: ${p.storagePath}`);
    else if (parent && !p.storagePath.startsWith(`gallery/${parent.slug}/${p.slug}/`))
      problems.push(`${name} has a storagePath outside gallery/${parent.slug}/${p.slug}/`);
    if (!(p.width > 0 && p.height > 0)) problems.push(`${name} has no pixel size`);
    if (p.published && !(p.alt.en && p.alt.ja)) problems.push(`${name} is published without alt.en and alt.ja`);
  }
  return problems;
}

const problems = validateGallery(store as Gallery);
if (problems.length > 0) throw new Error(`gallery.generated.json is invalid:\n- ${problems.join("\n- ")}`);

/**
 * The published gallery, in hanging order.
 *
 * Like projects, this reads the repository-managed store so rendering never
 * depends on Supabase. Pages only call these three functions; moving to live
 * queries later changes this file and nothing else.
 */
export async function getGallery(): Promise<Gallery> {
  const series = (store as Gallery).series.filter((s) => s.published).sort((a, b) => a.sortOrder - b.sortOrder);
  const order = new Map(series.map((s, i) => [s.id, i]));
  const photos = (store as Gallery).photos
    .filter((p) => p.published && order.has(p.seriesId))
    .sort((a, b) => order.get(a.seriesId)! - order.get(b.seriesId)! || a.sortOrder - b.sortOrder);
  return { series, photos };
}

export async function getSeries(slug: string): Promise<{ series: GallerySeries; photos: GalleryPhoto[] } | null> {
  const gallery = await getGallery();
  const series = gallery.series.find((s) => s.slug === slug);
  return series ? { series, photos: gallery.photos.filter((p) => p.seriesId === series.id) } : null;
}

export async function getPhoto(seriesSlug: string, photoSlug: string): Promise<{ series: GallerySeries; photo: GalleryPhoto } | null> {
  const found = await getSeries(seriesSlug);
  const photo = found?.photos.find((p) => p.slug === photoSlug);
  return found && photo ? { series: found.series, photo } : null;
}

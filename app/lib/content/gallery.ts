/**
 * View helpers for the gallery: where a photo's files are, its URL on the
 * site, and the facts a label may state. Nothing here invents a value; a
 * field the data does not carry is simply absent.
 */
import { fixtureUrl } from "../../components/gallery/fixture";
import type { Lang } from "../../types/common";
import type { GalleryFormat, GalleryPhoto, GallerySeries, GallerySize } from "../../types/gallery";
import { localized } from "./common";

/**
 * Files are read from public/media (written by `npm run gallery:import`)
 * unless this points at the bucket, e.g.
 * https://<ref>.supabase.co/storage/v1/object/public/portfolio-media
 */
const MEDIA_BASE = process.env.NEXT_PUBLIC_GALLERY_MEDIA_URL || "/media";

export function mediaUrl(photo: GalleryPhoto, size: GallerySize, format: GalleryFormat = "webp") {
  if (process.env.NODE_ENV !== "production" && photo.storagePath.startsWith("fixture/")) return fixtureUrl(photo, size);
  return `${MEDIA_BASE}/${photo.storagePath}-${size}.${format}`;
}

export const photoHref = (series: GallerySeries, photo: GalleryPhoto) => `/gallery/${series.slug}/${photo.slug}`;

export interface PhotoFacts {
  title?: string;
  place?: string;
  /** Month and year. */
  date?: string;
  year?: string;
  camera?: string;
  lens?: string;
  /** Aperture, shutter, ISO, focal length: whichever exist. */
  settings?: string;
}

export function photoFacts(photo: GalleryPhoto, lang: Lang): PhotoFacts {
  const taken = photo.takenAt ? new Date(photo.takenAt) : null;
  const e = photo.exposure;
  const settings = [
    e?.aperture && `f/${e.aperture}`,
    e?.shutter && (e.shutter >= 1 ? `${e.shutter} s` : `1/${Math.round(1 / e.shutter)} s`),
    e?.iso && `ISO ${e.iso}`,
    e?.focalLength && `${Math.round(e.focalLength)} mm`,
  ].filter(Boolean);
  return {
    title: localized(photo.title, lang) || undefined,
    place: localized(photo.place, lang) || undefined,
    date: taken ? new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-GB", { month: "long", year: "numeric" }).format(taken) : undefined,
    year: taken ? String(taken.getFullYear()) : undefined,
    camera: photo.camera,
    lens: photo.lens,
    settings: settings.length > 0 ? settings.join(" · ") : undefined,
  };
}

/**
 * Gallery content model. Mirrors the `gallery_*` tables in
 * supabase/migrations/202611160001_gallery.sql; the committed store is
 * app/content/gallery.generated.json, written by `npm run gallery:import`.
 */
import type { LocalizedText } from "./common";

export type GallerySeries = {
  id: string;
  slug: string;
  title: LocalizedText;
  description?: LocalizedText;
  coverPhotoId?: string;
  sortOrder: number;
  published: boolean;
};

export type GalleryExposure = {
  /** f-number, e.g. 2.8 */
  aperture?: number;
  /** Seconds, e.g. 0.004 for 1/250 */
  shutter?: number;
  iso?: number;
  /** Millimetres */
  focalLength?: number;
};

export type GalleryPhoto = {
  id: string;
  slug: string;
  seriesId: string;
  /** `gallery/<series>/<photo>/<hash>`; files are `<storagePath>-<size>.<avif|webp>`. */
  storagePath: string;
  width: number;
  height: number;
  blurDataURL: string;
  dominantColor: string;
  alt: LocalizedText;
  title?: LocalizedText;
  place?: LocalizedText;
  /** Camera-local time from EXIF, `YYYY-MM-DDTHH:mm:ss`, no zone. */
  takenAt?: string;
  camera?: string;
  lens?: string;
  exposure?: GalleryExposure;
  featured: boolean;
  sortOrder: number;
  published: boolean;
};

export type Gallery = {
  series: GallerySeries[];
  photos: GalleryPhoto[];
};

export const GALLERY_SIZES = [256, 1024, 2560] as const;
export const GALLERY_FORMATS = ["avif", "webp"] as const;
export type GallerySize = (typeof GALLERY_SIZES)[number];
export type GalleryFormat = (typeof GALLERY_FORMATS)[number];

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { mediaUrl } from "../../../lib/content/gallery";
import { getGallery, getPhoto } from "../../../lib/data/gallery";

type Params = { params: Promise<{ series: string; photo: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const gallery = await getGallery();
  const slugs = new Map(gallery.series.map((series) => [series.id, series.slug]));

  return gallery.photos.map((photo) => ({ series: slugs.get(photo.seriesId)!, photo: photo.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { series, photo } = await params;
  const found = await getPhoto(series, photo);

  if (!found) {
    notFound();
  }

  const title = `${found.photo.title?.en || found.photo.alt.en} — ${found.series.title.en}`;
  const image = { url: mediaUrl(found.photo, 1024), alt: found.photo.alt.en };

  return {
    title,
    description: found.photo.alt.en,
    openGraph: { title, description: found.photo.alt.en, type: "article", images: [image] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

/** The photo itself is drawn by the gallery layout, which reads this URL. */
export default async function GalleryPhotoPage({ params }: Params) {
  const { series, photo } = await params;

  if (!(await getPhoto(series, photo))) {
    notFound();
  }

  return null;
}

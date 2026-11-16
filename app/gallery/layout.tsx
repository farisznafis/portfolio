import type { ReactNode } from "react";

import { GalleryExperience } from "../components/gallery/GalleryExperience";
import { PageTransition } from "../components/ui/PageTransition";
import { getGallery } from "../lib/data/gallery";

/**
 * The hall lives in the layout, so it stays mounted while the URL moves
 * between /gallery and /gallery/[series]/[photo]. The pages below only carry
 * metadata; the experience reads the open photo from the pathname.
 */
export default async function GalleryLayout({ children }: { children: ReactNode }) {
  const gallery = await getGallery();

  return (
    <PageTransition>
      <GalleryExperience gallery={gallery} />
      {children}
    </PageTransition>
  );
}

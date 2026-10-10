import Image from "next/image";
import clsx from "clsx";

/**
 * Cover for a fixed card frame that never crops: the whole image sits on a
 * blurred fill of itself, so portrait and landscape covers both read well.
 * The parent must be positioned and sized (Next `fill`).
 */
export default function CoverImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes={sizes}
        className="scale-110 object-cover opacity-60 blur-2xl"
      />
      <Image src={src} alt={alt} fill sizes={sizes} className={clsx("object-contain", className)} />
    </>
  );
}

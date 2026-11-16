/**
 * Development-only stress fixture (`/gallery?fixture=1000`): synthetic
 * gradients with a frame number, never anything that could pass for a photo.
 * Every caller sits behind `process.env.NODE_ENV !== "production"`.
 */
import type { Gallery, GalleryPhoto } from "../../types/gallery";

const RATIOS = [3 / 2, 2 / 3, 4 / 3, 1, 16 / 9, 4 / 5];
const PER_WING = 125;

const hue = (n: number) => (n * 47) % 360;
const hex = (h: number, s: number, l: number) => {
  const f = (k: number) => {
    const a = s * Math.min(l, 1 - l);
    const t = (k + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(t - 3, 9 - t, 1))))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export function fixtureGallery(count: number): Gallery {
  const wing = (i: number) => `fixture-wing-${Math.floor(i / PER_WING) + 1}`;
  return {
    series: Array.from({ length: Math.ceil(count / PER_WING) }, (_, i) => ({
      id: wing(i * PER_WING),
      slug: wing(i * PER_WING),
      title: { en: `Fixture wing ${i + 1}`, ja: `フィクスチャ ${i + 1}` },
      description: { en: "Synthetic placeholders for stress testing.", ja: "負荷テスト用の合成プレースホルダー。" },
      sortOrder: i,
      published: true,
    })),
    photos: Array.from({ length: count }, (_, i) => {
      const ratio = RATIOS[(i * 7 + Math.floor(i / 5)) % RATIOS.length];
      return {
        id: `fixture-${i + 1}`,
        slug: String(i + 1).padStart(4, "0"),
        seriesId: wing(i),
        storagePath: `fixture/${i + 1}`,
        width: Math.round(1200 * Math.sqrt(ratio)),
        height: Math.round(1200 / Math.sqrt(ratio)),
        blurDataURL: "",
        dominantColor: hex(hue(i + 1), 0.45, 0.24),
        alt: { en: `Synthetic placeholder ${i + 1}`, ja: `合成プレースホルダー ${i + 1}` },
        title: { en: `Placeholder ${i + 1}`, ja: `プレースホルダー ${i + 1}` },
        featured: false,
        sortOrder: i,
        published: true,
      };
    }),
  };
}

export function fixtureCanvas(photo: GalleryPhoto, size: number) {
  const n = Number(photo.storagePath.split("/")[1]);
  const scale = size / Math.max(photo.width, photo.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(photo.width * scale);
  canvas.height = Math.round(photo.height * scale);
  const ctx = canvas.getContext("2d")!;
  const fill = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  fill.addColorStop(0, hex(hue(n), 0.5, 0.36));
  fill.addColorStop(1, hex(hue(n) + 50, 0.55, 0.12));
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${size * 0.2}px monospace`;
  ctx.fillText(String(n).padStart(4, "0"), canvas.width / 2, canvas.height / 2);
  ctx.font = `${size * 0.035}px monospace`;
  ctx.fillText(`SYNTHETIC ${size}PX`, canvas.width / 2, canvas.height / 2 + size * 0.16);
  return canvas;
}

export const fixtureUrl = (photo: GalleryPhoto, size: number) => fixtureCanvas(photo, Math.min(size, 1024)).toDataURL("image/webp", 0.8);

/** Shared OG image for non-post pages, generated at build time. */
/* global Response */
import { SITE } from '../config';
import { generateOgImage } from '../utils/og-image';

export async function GET() {
  const png = await generateOgImage({
    title: SITE.title,
    description: SITE.description,
  });

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
}

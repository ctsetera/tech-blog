/** Astro content IDs are derived from filenames without the extension. */
interface NamedPost {
  id: string;
  data: { pinned: boolean };
}

/** Compare IDs as strings, descending (not as numbers or publication dates). */
function compareFilenames(a: NamedPost, b: NamedPost): number {
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}

/** Listings: pinned posts first, then filename descending within each group. */
export function sortPosts<T extends NamedPost>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
    return compareFilenames(a, b);
  });
}

/** Previous/next navigation follows filename order regardless of pinning. */
export function sortPostsByFilename<T extends NamedPost>(posts: readonly T[]): T[] {
  return [...posts].sort(compareFilenames);
}

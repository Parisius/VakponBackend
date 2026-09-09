export const PAGE_SLUGS = ['guide-du-voyageur', 'a-propos'] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];
